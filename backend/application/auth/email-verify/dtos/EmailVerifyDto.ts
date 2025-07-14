export interface EmailVerifyDto {
  email: string
}

export interface EmailVerifyResponseDto {
  message: string
  status: number
  isAvailable?: boolean
  error?: string
}
