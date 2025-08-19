import api from '../axios/instance'

import {
  type RegisterRequest,
  type LoginRequest,
  type LoginResponse,
  type UserResponse,
  type UserProfileUpdateRequest,
  type UserPasswordUpdateRequest,
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

export const logout = async (): Promise<boolean> => {
  const response = await api.post('/user/logout')
  const success = response.status >= 200 && response.status < 300

  return success
}

export const getUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/user/me')

  return response.data
}

export const updateUserProfile = async (
  payload: UserProfileUpdateRequest,
): Promise<UserResponse> => {
  const response = await api.put<UserResponse>('/user/me/profile', payload)

  return response.data
}

export const updateUserPassword = async (payload: UserPasswordUpdateRequest): Promise<boolean> => {
  const response = await api.put('/user/me/password', payload)
  const success = response.status >= 200 && response.status < 300

  return success
}
