export interface RegisterRequest {
  email: string
  password: string
  name: string
  address: string
  phone: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}
