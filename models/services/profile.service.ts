import { UserProfileResponseDto } from '@be/application/user/profile/dtos/UserProfileDto'
import instance from '@utils/instance'

// global type으로 빼기
interface ApiResponse<T> {
  success: boolean
  data: T
}

const PATH = '/api/user/profile'

export const getProfileService = async () => {
  const res = await instance.get<ApiResponse<UserProfileResponseDto>>(PATH)

  return res.data.data
}

export const updateProfileService = async (data: { nickname: string; profileImgUrl: string }) => {
  const res = await instance.patch<ApiResponse<UserProfileResponseDto>>(PATH, data)

  return res.data.data
}
