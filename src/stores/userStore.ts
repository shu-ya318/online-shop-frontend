import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getUser,
} from '@/api/user'

import type { RegisterRequest, LoginRequest, UserResponse } from '@/api/user/interface'

export const useUserStore = defineStore(
  'user',
  () => {
    // States
    const token = ref<string | null>(null)
    const isInitialized = ref(false)
    const userInfo = ref<UserResponse | null>(null)

    const isAuthenticated = computed(() => {
      return !!(token.value && userInfo.value)
    })

    const verifyToken = (): boolean => {
      if (!token.value) return false

      try {
        const decodedToken = jwtDecode<{ exp: number }>(token.value)
        const currentTime = Math.floor(Date.now() / 1000)

        return decodedToken.exp > currentTime
      } catch {
        return false
      }
    }

    // Actions
    const setToken = (newToken: string): void => {
      token.value = newToken
    }

    const removeToken = () => {
      token.value = null
    }

    const register = async (credentials: RegisterRequest): Promise<void> => {
      try {
        await apiRegister(credentials)
      } catch (error) {
        throw error
      }
    }

    const fetchUser = async (): Promise<void> => {
      try {
        const response = await getUser()
        userInfo.value = response
      } catch (error) {
        userInfo.value = null
        throw error
      }
    }

    const login = async (credentials: LoginRequest): Promise<void> => {
      try {
        const response = await apiLogin(credentials)
        if (response.accessToken) {
          setToken(response.accessToken)
          await fetchUser()
        }
      } catch (error) {
        removeToken()
        userInfo.value = null
        throw error
      }
    }

    const logout = async (): Promise<void> => {
      try {
        await apiLogout()
      } finally {
        removeToken()
        userInfo.value = null
      }
    }

    const initializeAuth = async (): Promise<void> => {
      if (isInitialized.value) return

      const isTokenValid = verifyToken()
      if (isTokenValid) {
        try {
          await fetchUser()
        } catch {
          logout()
        }
      }

      isInitialized.value = true
    }

    return {
      // States
      isInitialized,
      token,
      userInfo,
      isAuthenticated,
      // Utilities
      verifyToken,
      // Actions
      register,
      fetchUser,
      login,
      logout,
      initializeAuth,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['token'],
    },
  },
)
