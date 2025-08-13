import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { register as apiRegister, login as apiLogin, logout as apiLogout } from '@/api/auth/index'
import { getCurrentUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/service/tokenService'
import type { RegisterRequest, LoginRequest } from '@/api/auth/interface'
import type { CurrentUserResponse } from '@/api/user/interface'

export const useAuthStore = defineStore('auth', () => {
  // States
  const isAuthLoading = ref<boolean>(false)
  const isAuthenticated = ref<boolean>(false)
  const user = ref<CurrentUserResponse | null>(null)
  const error = ref<string | null>(null)

  // Getters
  const authStatus = computed(() => ({
    isAuthLoading: isAuthLoading.value,
    isAuthenticated: isAuthenticated.value,
    user: user.value,
    error: error.value,
  }))

  // Utilities
  const toErrorMessage = (e: unknown, fallback: string): string => {
    if (
      e &&
      typeof e === 'object' &&
      'message' in (e as Record<string, unknown>) &&
      typeof (e as Record<string, unknown>).message === 'string'
    ) {
      return ((e as Record<string, unknown>).message as string) || fallback
    }
    try {
      return String(e) || fallback
    } catch {
      return fallback
    }
  }

  const isTokenValid = (): boolean => {
    const token = getToken()

    if (!token) return false

    try {
      const decodedToken = jwtDecode<{ exp: number }>(token)
      const currentTime = Math.floor(Date.now() / 1000)
      return decodedToken.exp > currentTime
    } catch {
      return false
    }
  }

  // Actions

  // User
  const register = async (credentials: RegisterRequest): Promise<boolean> => {
    isAuthLoading.value = true
    error.value = null

    try {
      await apiRegister(credentials)
      return true
    } catch (e) {
      error.value = toErrorMessage(e, 'register failed')
      return false
    } finally {
      isAuthLoading.value = false
    }
  }

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    isAuthLoading.value = true
    error.value = null

    try {
      const response = await apiLogin(credentials)
      if (response.token) {
        setToken(response.token)
        await setAuth()
        return true
      }

      return false
    } catch (e) {
      error.value = toErrorMessage(e, 'login failed')
      return false
    } finally {
      isAuthLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isAuthLoading.value = true

    try {
      await apiLogout()
    } catch (e) {
      error.value = toErrorMessage(e, 'logout failed')
    } finally {
      clearAuth()
      isAuthLoading.value = false
    }
  }

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const response = await getCurrentUser()
      user.value = response
    } catch (e) {
      error.value = toErrorMessage(e, 'fetch current user failed')
      throw e
    }
  }

  // Auth
  const setAuth = async (): Promise<void> => {
    if (!isTokenValid()) {
      clearAuth()
      return
    }

    try {
      await fetchCurrentUser()
      isAuthenticated.value = true
    } catch (e) {
      console.error('Failed to set auth:', e)
      clearAuth()
      throw e
    }
  }

  const clearAuth = (): void => {
    isAuthenticated.value = false
    user.value = null
    error.value = null

    removeToken()
  }

  return {
    // States
    isAuthLoading,
    isAuthenticated,
    user,
    error,
    // Getters
    authStatus,
    // Utilities
    isTokenValid,
    // Actions
    register,
    login,
    logout,
    fetchCurrentUser,
    setAuth,
    clearAuth,
  }
})
