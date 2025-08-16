import { axiosInstance } from '../axios/instance'

import type {
  // CurrentUserResponse,
  // UserPasswordUpdateRequest,
  // UserProfileUpdateRequest,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
} from './interface'

export const register = async (payload: RegisterRequest): Promise<void> => {
  const response = await axiosInstance.post('/public/user/register', payload)
  return response.data
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/public/user/login', payload)
  return response.data
}

// export const logout = async (): Promise<void> => {
//   await axiosInstance.post('/user/logout')
// }

// export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
//   const response = await axiosInstance.get('/user/me')
//   return response.data
// }

// export const updateUserProfile = async (
//   payload: UserProfileUpdateRequest,
// ): Promise<CurrentUserResponse> => {
//   const response = await axiosInstance.put<CurrentUserResponse>('/user/me/profile', payload)
//   return response.data
// }

// export const updateUserPassword = async (payload: UserPasswordUpdateRequest): Promise<void> => {
//   await axiosInstance.put('/user/me/password', payload)
// }
