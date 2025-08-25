import api from '@/api/axios/instance'

import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
  UserProfileUpdateRequest,
  UserPasswordUpdateRequest,
  RefreshTokenResponse,
} from './interface'

export const register = async (payload: RegisterRequest): Promise<void> => {
  await api.post<void>('/public/user/register', payload)
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/public/user/login', payload)

  return response.data
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>('/user/refresh-token')

  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/user/logout')
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

export const updateUserPassword = async (payload: UserPasswordUpdateRequest): Promise<void> => {
  await api.put('/user/me/password', payload)
}
