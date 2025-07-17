import { Role } from '@be/domain/entities/Role'

export interface GetUserProfileQueryDto {
  userId: string
}

export interface UserProfileResponseDto {
  user_id: string
  username: string
  email: string
  nickname: string
  phone: string
  profile_img_url: string
  provider: string
  provider_id: string
  created_at: string
  updated_at: string
  user_role?: Role
  town_name?: string // 추가: 사용자의 등록된 도시명
}
