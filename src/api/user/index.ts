import api from '../axios/instance'

import {
  type RegisterRequest,
  type LoginRequest,
  type LoginResponse,
  type CurrentUserResponse,
} from './interface'

export const register = async (payload: RegisterRequest): Promise<boolean> => {
  const response = await api.post('/public/user/register', payload)
  const success = response.status >= 200 && response.status < 300
  return success
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/public/user/login', payload)
  return response.data
}

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await api.get<CurrentUserResponse>('/user/me')
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/user/logout')
}

// export const updateUserProfile = async (
//   payload: UserProfileUpdateRequest,
// ): Promise<CurrentUserResponse> => {
//   const response = await axiosInstance.put<CurrentUserResponse>('/user/me/profile', payload)
//   return response.data
// }

// export const updateUserPassword = async (payload: UserPasswordUpdateRequest): Promise<void> => {
//   await axiosInstance.put('/user/me/password', payload)
// }
