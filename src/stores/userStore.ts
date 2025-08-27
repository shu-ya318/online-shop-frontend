import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getUser,
  // refreshToken as apiRefreshToken,
} from '@/api/user'

import type {
  RegisterRequest,
  LoginRequest,
  UserResponse,
  SuccessResponse,
} from '@/api/user/interface'

export const useUserStore = defineStore(
  'user',
  () => {
    // States
    const token = ref<string | null>(null)
    const isInitialized = ref(false)
    // const isRefreshing = ref(false)
    // const failedQueue: Array<{
    //   resolve: (value: string | unknown) => void
    //   reject: (reason?: unknown) => void
    // }> = []
    const userInfo = ref<UserResponse | null>(null)

    const isAuthenticated = computed(() => {
      return !!(token.value && userInfo.value)
    })

    // Utils
    // const processQueue = (error: unknown, tokenValue: string | null = null) => {
    //   failedQueue.forEach((prom) => {
    //     if (error) {
    //       prom.reject(error)
    //     } else {
    //       prom.resolve(tokenValue)
    //     }
    //   })

    //   failedQueue.length = 0
    // }

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

    const register = async (credentials: RegisterRequest): Promise<SuccessResponse> => {
      try {
        const response = await apiRegister(credentials)

        return response
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

    const logout = async (): Promise<SuccessResponse> => {
      try {
        const response = await apiLogout()

        return response
      } finally {
        removeToken()
        userInfo.value = null
      }
    }

    // const refreshToken = async (): Promise<string> => {
    //   if (isRefreshing.value) {
    //     return new Promise<unknown>((resolve, reject) => {
    //       failedQueue.push({ resolve, reject })
    //     }) as Promise<string>
    //   }

    //   isRefreshing.value = true

    //   try {
    //     const { accessToken } = await apiRefreshToken()
    //     setToken(accessToken)
    //     processQueue(null, accessToken)

    //     return accessToken
    //   } catch (error) {
    //     processQueue(error, null)
    //     logout()

    //     return Promise.reject(error)
    //   } finally {
    //     isRefreshing.value = false
    //   }
    // }

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
      // refreshToken,
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
