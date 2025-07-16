import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'

export interface DeleteUserTownDto {
  id: number
  userId: string
}

export class DeleteUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(dto: DeleteUserTownDto): Promise<void> {
    await this.repo.delete(dto)
  }
}
