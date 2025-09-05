import api from '@/api/axios/instance'

import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
  UserProfileUpdateRequest,
  UserPasswordUpdateRequest,
  RefreshTokenResponse,
  ResultResponse,
} from './interface'

export const register = async (request: RegisterRequest): Promise<ResultResponse> => {
  const response = await api.post<ResultResponse>('/public/user/register', request)

  return response.data
}

export const exchangeOAuth2Code = async (request: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/public/user/oauth2/exchange-code', {
    oauth2Code: request,
  })

  return response.data
}

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/public/user/login', request)

  return response.data
}

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>('/user/refresh-token')

  return response.data
}

export const logout = async (): Promise<ResultResponse> => {
  const response = await api.post<ResultResponse>('/user/logout')

  return response.data
}

export const getUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/user/me')

  return response.data
}

export const updateUserProfile = async (
  request: UserProfileUpdateRequest,
): Promise<UserResponse> => {
  const response = await api.put<UserResponse>('/user/me/profile', request)

  return response.data
}

export const updateUserPassword = async (
  request: UserPasswordUpdateRequest,
): Promise<ResultResponse> => {
  const response = await api.put<ResultResponse>('/user/me/password', request)

  return response.data
}
