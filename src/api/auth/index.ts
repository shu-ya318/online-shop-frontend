import { axiosInstance } from '../axios/instance'
import axios, { AxiosError } from 'axios'
import type { RegisterRequest, LoginRequest, LoginResponse } from './types'

export const isEmailExist = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get<boolean>(`/members/validation/email?email=${email}`)
    return !response.data
  } catch (error) {
    const status =
      (error as AxiosError)?.status ||
      (axios.isAxiosError(error) ? error.response?.status : undefined)
    if (status === 404) {
      return false
    }
    throw error
  }
}

export const register = async (payload: RegisterRequest): Promise<void> => {
  const response = await axiosInstance.post('/members/auth/register', payload)
  return response.data
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/members/auth/login', payload)
  return response.data
}

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/members/auth/logout')
}
