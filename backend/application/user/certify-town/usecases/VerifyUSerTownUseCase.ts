import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'
import { CreateUserTownDto, UserTownDto } from '../dtos/UserTownDto'

export class VerifyUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(dto: CreateUserTownDto): Promise<UserTownDto> {
    const towns = await this.repo.findByUserId(dto.userId)
    if (towns.length >= 3) {
      throw new Error('동네는 최대 3개까지 인증할 수 있습니다.')
    }

    if (towns.some((t) => t.townName === dto.townName)) {
      throw new Error('이미 인증한 동네입니다.')
    }

    return await this.repo.create(dto)
  }
}
