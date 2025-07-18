import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'
import { UserTownDto } from '../dtos/UserTownDto'

export class GetUserTownListUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(userId: string): Promise<UserTownDto[]> {
    const towns = await this.repo.findByUserId(userId)
    return towns ?? [] // null 또는 undefined인 경우 빈 배열 반환
  }
}
