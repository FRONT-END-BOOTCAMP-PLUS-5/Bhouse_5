import { Role } from '@be/domain/entities/Role'

export interface GetUserProfileQueryDto {
  userId: string
}

export interface UserTownDto {
  id: number
  town_name: string
  is_primary: boolean
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
  towns: UserTownDto[] // 모든 타운 정보 리스트
  primary_town_id?: number // primary 타운의 ID
}
