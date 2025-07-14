import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'

export class GetUserTownListUseCase {
  constructor(private repo: UserTownRepository) {}

  execute(userId: string) {
    return this.repo.findByUserId(userId)
  }
}
