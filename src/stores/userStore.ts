import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import { useNotification } from '@/composables/useNotification'

import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/service/tokenService'

import type { RegisterRequest, LoginRequest, CurrentUserResponse } from '@/api/user/interface'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()

  const { showSuccess } = useNotification()

  // States
  const isAuthenticated = ref(false)
  const currentUser = ref<CurrentUserResponse | null>(null)

  // Getters
  const authStatus = computed(() => ({
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
  }))

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
  const register = async (credentials: RegisterRequest): Promise<void> => {
    const success = await apiRegister(credentials)
    if (success) {
      router.push({ name: 'login' })
      showSuccess('Registration successful!')
    }
  }

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await apiLogin(credentials)
    if (response.token) {
      setToken(response.token)
      // await setAuth()
    }

    router.push({ name: 'home' })
    showSuccess('Login success!')
  }

  const logout = async (): Promise<void> => {
    await apiLogout()
    clearAuth()
  }

  const fetchCurrentUser = async (): Promise<void> => {
    const response = await getCurrentUser()
    currentUser.value = response
  }

  const setAuth = async (): Promise<void> => {
    if (!isTokenValid()) {
      clearAuth()
      return
    }

    await fetchCurrentUser()
    isAuthenticated.value = true
  }

  const clearAuth = (): void => {
    isAuthenticated.value = false
    currentUser.value = null

    removeToken()
  }

  return {
    // States
    isAuthenticated,
    currentUser,
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
