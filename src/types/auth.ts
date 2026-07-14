export interface LoginRequest {
  username: string
  password: string
}

export interface AuthenticationToken {
  tokenType: string
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthApiResponse<T> {
  code: string | number
  data: T
  msg: string
  message?: string
}
