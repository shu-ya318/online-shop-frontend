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

import type { RegisterRequest, LoginRequest, CurrentUserResponse } from '@/api/user/interface'

export const useUserStore = defineStore(
  'user',
  () => {
    const router = useRouter()

    const { showSuccess } = useNotification()

    // States
    const isAuthenticated = ref(false)
    const token = ref<string | null>(null)
    const userInfo = ref<CurrentUserResponse | null>(null)

    // Getters
    const authStatus = computed(() => ({
      isAuthenticated: isAuthenticated.value,
      token: token.value,
      userInfo: userInfo.value,
    }))

    const isTokenValid = (): boolean => {
      const token = authStatus.value.token

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
      const response = await getCurrentUser()
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
        router.push({ name: 'home' })
        showSuccess('Logout successful!')
      }
    }

    return {
      // States
      isAuthenticated,
      token,
      userInfo,
      // Getters
      authStatus,
      // Utilities
      isTokenValid,
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
