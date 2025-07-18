import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'

export interface DeleteUserTownDto {
  userId: string
  townName: string
}

export class DeleteUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(dto: DeleteUserTownDto): Promise<void> {
    await this.repo.delete(dto)
  }
}
