import { STORAGE_TOKEN_KEY } from '@/constants/index'

export const setToken = (token: string): void => {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available')
  }

  localStorage.setItem(STORAGE_TOKEN_KEY, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_TOKEN_KEY)
}

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_TOKEN_KEY)
}
