import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

import { useNotification } from '@/composables/useNotification'

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
    const router = useRouter()

    const { showSuccess } = useNotification()

    // States
    const isAuthenticated = ref(false)
    const token = ref<string | null>(null)
    const userInfo = ref<UserResponse | null>(null)

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
      isAuthenticated.value = true
    }

    const removeToken = () => {
      token.value = null
      isAuthenticated.value = false
    }

    const register = async (credentials: RegisterRequest): Promise<void> => {
      const success = await apiRegister(credentials)
      if (success) {
        router.push({ name: 'login' })
        showSuccess('Registration successful!')
      }
    }

    const fetchUser = async (): Promise<void> => {
      const response = await getUser()
      if (response) userInfo.value = response
    }

    const login = async (credentials: LoginRequest): Promise<void> => {
      const response = await apiLogin(credentials)
      if (response.token) {
        setToken(response.token)
        await fetchUser()
        router.push({ name: 'home' })
        showSuccess('Login successful!')
      }
    }

    const logout = async (): Promise<void> => {
      const success = await apiLogout()
      if (success) {
        removeToken()
        userInfo.value = null
        showSuccess('Logout successful!')
      }
    }

    return {
      // States
      isAuthenticated,
      token,
      userInfo,
      // Utilities
      verifyToken,
      // Actions
      register,
      fetchUser,
      login,
      logout,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['token'],
    },
  },
)
