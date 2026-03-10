import api from '@/api/axios/instance'

import type { SuccessResponse } from '@/api/common/interface'
import type {
  RegisterRequest,
  LoginRequest,
  UserResponse,
  UserProfileUpdateRequest,
  UserPasswordUpdateRequest,
  TokenResponse,
} from './interface'

/*
 * POST method
 */

export const register = async (request: RegisterRequest): Promise<SuccessResponse> => {
  const response = await api.post<SuccessResponse>('/public/users/register', request)

  return response.data
}

export const login = async (request: LoginRequest): Promise<string> => {
  const response = await api.post<TokenResponse>('/public/users/login', request)

  return response.data.accessToken
}

export const exchangeOauth2Code = async (oauth2Code: string): Promise<string> => {
  const response = await api.post<TokenResponse>('/public/users/oauth2/exchange-code', {
    oauth2Code,
  })

  return response.data.accessToken
}

export const refreshTokens = async (): Promise<string> => {
  const response = await api.post<TokenResponse>('/public/users/refresh-tokens')

  return response.data.accessToken
}

export const logout = async (): Promise<SuccessResponse> => {
  const response = await api.post<SuccessResponse>('/public/users/logout')

  return response.data
}

/*
 * GET method
 */

export const getUser = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>('/users/me')

  return response.data
}

/*
 * PUT method
 */

export const updateUserProfile = async (
  request: UserProfileUpdateRequest,
): Promise<UserResponse> => {
  const response = await api.put<UserResponse>('/users/me/profile', request)

  return response.data
}

export const updateUserPassword = async (
  request: UserPasswordUpdateRequest,
): Promise<SuccessResponse> => {
  const response = await api.put<SuccessResponse>('/users/me/password', request)

  return response.data
}
