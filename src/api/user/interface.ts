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
  accessToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface UserResponse {
  uuid: string
  email: string
  name: string
  phoneNumber: string
  birth: string
  address: string
}

export interface UserProfileUpdateRequest {
  name: string
  phoneNumber: string
  birth: string
  address: string
}

export interface UserPasswordUpdateRequest {
  oldPassword: string
  newPassword: string
}

export interface ResultResponse {
  message: string
}
