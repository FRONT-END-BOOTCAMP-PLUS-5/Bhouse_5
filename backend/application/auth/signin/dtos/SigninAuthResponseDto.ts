export interface SigninAuthResponseDto {
  message: string
  status: number
  user?: {
    user_id: string
    email: string
    username: string
    roles?: {
      userId: string
      roleId: number
    }
  }
  accessToken?: string
  refreshToken?: string
  error?: string
}
