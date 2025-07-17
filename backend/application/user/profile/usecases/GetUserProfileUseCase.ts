import { UserRepository } from '@domain/repositories/UserRepository'
import { UserTownRepository } from '@domain/repositories/UserTownRepository'
import { GetUserProfileQueryDto, UserProfileResponseDto, UserTownDto } from '../dtos/UserProfileDto'

export class GetUserProfileUseCase {
  private userRepository: UserRepository
  private userTownRepository: UserTownRepository

  constructor(userRepository: UserRepository, userTownRepository: UserTownRepository) {
    this.userRepository = userRepository
    this.userTownRepository = userTownRepository
  }

  async execute(queryDto: GetUserProfileQueryDto): Promise<UserProfileResponseDto | null> {
    const user = await this.userRepository.findById(queryDto.userId)

    if (!user) {
      return null
    }

    // 사용자의 등록된 도시 정보 가져오기
    const userTowns = await this.userTownRepository.findByUserId(queryDto.userId)
    console.log('User Towns:', userTowns) // 콘솔 로그 추가

    // 모든 타운 정보를 DTO로 변환
    const towns: UserTownDto[] = userTowns.map((town) => ({
      id: town.id,
      town_name: town.townName,
      is_primary: town.isPrimary,
    }))

    // primary 타운의 ID 찾기
    const primaryTown = userTowns.find((town) => town.isPrimary)
    const primaryTownId = primaryTown?.id

    console.log(user)
    return {
      user_id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      phone: user.phone || '',
      profile_img_url: user.profileImgUrl || '',
      provider: user.provider || '',
      provider_id: user.providerId || '',
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt?.toISOString() || user.createdAt.toISOString(),
      user_role: user.userRole?.roles,
      towns: towns, // 모든 타운 정보 리스트
      primary_town_id: primaryTownId, // primary 타운의 ID
    }
  }
}
