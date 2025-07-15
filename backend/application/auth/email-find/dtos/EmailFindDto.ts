export interface EmailFindRequestDto {
  username: string
  phone: string
}

export interface EmailFindResponseDto {
  message: string
  status: number
  error?: string
  email?: string
}
