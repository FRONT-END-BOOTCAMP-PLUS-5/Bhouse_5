export interface CreateAuthDto {
  username: string
  email: string
  password: string
  nickname?: string
  phone?: string
  profile_img_url?: string
  provider?: string
  provider_id?: string
  roleId: number
}

export interface CreateAuthResponseDto {
  message: string
  status: number
  error?: string
}
