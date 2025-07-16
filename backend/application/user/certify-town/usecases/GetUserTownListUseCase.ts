import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'
import { UserTownDto } from '../dtos/UserTownDto'

export class GetUserTownListUseCase {
  constructor(private repo: UserTownRepository) {}

  execute(userId: string): Promise<UserTownDto[]> {
    return this.repo.findByUserId(userId)
  }
}
