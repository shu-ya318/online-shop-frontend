export interface RegisterRequest {
  email: string
  password: string
  name: string
  phoneNumber: string
  birth: string
  address: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface CurrentUserResponse {
  id: string
  uuid: string
  email: string
  name: string
  address: string
  phoneNumber: string
}

export interface UserProfileUpdateRequest {
  name: string
  address: string
  phoneNumber: string
}

export interface UserPasswordUpdateRequest {
  newPassword: string
}
