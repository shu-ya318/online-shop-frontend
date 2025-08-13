export interface CurrentUserResponse {
  id: string
  uuid: string
  email: string
  name: string
  address: string
  phone: string
}

export interface UpdateUserProfileRequest {
  name: string
  address: string
  phone: string
}

export interface UpdateUserPasswordRequest {
  newPassword: string
}
