import { UserRepository } from '@domain/repositories/UserRepository'
import { UserTownRepository } from '@domain/repositories/UserTownRepository'
import { GetUserProfileQueryDto, UserProfileResponseDto } from '../dtos/UserProfileDto'

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

    // is_primary가 true인 도시를 우선적으로 선택, 없으면 첫 번째 도시
    const primaryTown = userTowns.find((town) => town.isPrimary) || userTowns[0]
    const townName = primaryTown?.townName
    console.log('Selected Town Name:', townName) // 콘솔 로그 추가

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
      town_name: townName, // 추가
    }
  }
}
