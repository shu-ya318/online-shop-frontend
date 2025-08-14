import { axiosInstance } from '../axios/instance'

import type {
  CurrentUserResponse,
  UserPasswordUpdateRequest,
  UserProfileUpdateRequest,
} from './interface'

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await axiosInstance.get('/members/me')
  return response.data
}

export const updateUserProfile = async (
  payload: UserProfileUpdateRequest,
): Promise<CurrentUserResponse> => {
  const response = await axiosInstance.put<CurrentUserResponse>('/members/me/profile', payload)
  return response.data
}

export const updateUserPassword = async (payload: UserPasswordUpdateRequest): Promise<void> => {
  await axiosInstance.put('/members/me/password', payload)
}
