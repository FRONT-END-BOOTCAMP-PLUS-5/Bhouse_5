import { UserRepository } from '@domain/repositories/UserRepository'
import { GetUserProfileQueryDto, UserProfileResponseDto } from '../dtos/UserProfileDto'

export class GetUserProfileUseCase {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(queryDto: GetUserProfileQueryDto): Promise<UserProfileResponseDto | null> {
    const user = await this.userRepository.findById(queryDto.userId)

    if (!user) {
      return null
    }

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
    }
  }
}
