export interface PasswordFindRequestDto {
  username: string
  email: string
  phone: string
}

export interface PasswordFindResponseDto {
  message: string
  status: number
  error?: string
  userId?: string
  isVerified?: boolean
}
