import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import {
  register as apiRegister,
  login as apiLogin,
  exchangeOAuth2Code as apiExchangeOAuth2Code,
  logout as apiLogout,
  getUser,
  // refreshToken as apiRefreshToken,
} from '@/api/user'

import type {
  RegisterRequest,
  LoginRequest,
  UserResponse,
  ResultResponse,
} from '@/api/user/interface'

export const useUserStore = defineStore(
  'user',
  () => {
    // States
    const accessToken = ref<string | null>(null)
    const isInitialized = ref(false)
    // const isRefreshing = ref(false)
    // const failedQueue: Array<{
    //   resolve: (value: string | unknown) => void
    //   reject: (reason?: unknown) => void
    // }> = []
    const userInfo = ref<UserResponse | null>(null)

    const isAuthenticated = computed(() => {
      return !!(accessToken.value && userInfo.value)
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

    // Actions
    const setAccessToken = (newAccessToken: string) => {
      accessToken.value = newAccessToken
    }

    const removeAccessToken = () => {
      accessToken.value = null
    }

    const register = async (credentials: RegisterRequest): Promise<ResultResponse> => {
      try {
        const response = await apiRegister(credentials)

        return response
      } catch (error) {
        throw error
      }
    }

    const fetchUserInfo = async () => {
      try {
        const response = await getUser()
        userInfo.value = response
      } catch (error) {
        userInfo.value = null
        throw error
      }
    }

    const exchangeOAuth2Code = async (credentials: string) => {
      try {
        const response = await apiExchangeOAuth2Code(credentials)

        if (response.accessToken) {
          setAccessToken(response.accessToken)
          await fetchUserInfo()
        }
      } catch (error) {
        removeAccessToken()
        userInfo.value = null
        throw error
      }
    }

    const login = async (credentials: LoginRequest) => {
      try {
        const response = await apiLogin(credentials)
        console.log('store的accessToken', accessToken.value)
        if (response.accessToken) {
          setAccessToken(response.accessToken)
          await fetchUserInfo()
        }
      } catch (error) {
        removeAccessToken()
        userInfo.value = null
        throw error
      }
    }

    const logout = async (): Promise<ResultResponse> => {
      try {
        const response = await apiLogout()

        return response
      } finally {
        removeAccessToken()
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
    //     setAccessToken(accessToken)
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

    const verifyAccessToken = () => {
      if (!accessToken.value) return false

      try {
        const decodedToken = jwtDecode<{ exp: number }>(accessToken.value)
        const currentTime = Math.floor(Date.now() / 1000)

        return decodedToken.exp > currentTime
      } catch {
        return false
      }
    }

    const initializeAuth = async () => {
      if (isInitialized.value) return

      const isTokenValid = verifyAccessToken()

      if (isTokenValid) {
        try {
          await fetchUserInfo()
        } catch {
          logout()
        }
      }

      isInitialized.value = true
    }

    return {
      // States
      isInitialized,
      accessToken,
      userInfo,
      isAuthenticated,
      // Utilities
      verifyAccessToken,
      // Actions
      setAccessToken,
      register,
      fetchUserInfo,
      login,
      exchangeOAuth2Code,
      logout,
      // refreshToken,
      initializeAuth,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['accessToken'],
    },
  },
)
