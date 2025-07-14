export interface SigninAuthResponseDto {
  message: string
  status: number
  user?: {
    user_id: string
    email: string
    username: string
    roleId?: string
  }
  accessToken?: string
  refreshToken?: string
  error?: string
}
