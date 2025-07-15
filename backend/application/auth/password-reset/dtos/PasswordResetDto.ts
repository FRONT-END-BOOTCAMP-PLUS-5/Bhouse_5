export interface PasswordResetRequestDto {
  userId: string
  newPassword: string
}

export interface PasswordResetResponseDto {
  message: string
  status: number
  error?: string
  success?: boolean
}
