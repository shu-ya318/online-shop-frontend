import { axiosInstance } from '../axios/instance'

import type {
  CurrentUserResponse,
  UpdateUserPasswordRequest,
  UpdateUserProfileRequest,
} from './types'

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await axiosInstance.get('/members/me')
  return response.data
}

export const updateUserProfile = async (
  payload: UpdateUserProfileRequest,
): Promise<CurrentUserResponse> => {
  const response = await axiosInstance.put<CurrentUserResponse>('/members/me/profile', payload)
  return response.data
}

export const updateUserPassword = async (payload: UpdateUserPasswordRequest): Promise<void> => {
  await axiosInstance.put('/members/me/password', payload)
}
