export interface CurrentUserResponse {
  id: string
  uuid: string
  email: string
  name: string
  address: string
  phone: string
}

export interface UserProfileUpdateRequest {
  name: string
  address: string
  phone: string
}

export interface UserPasswordUpdateRequest {
  newPassword: string
}
