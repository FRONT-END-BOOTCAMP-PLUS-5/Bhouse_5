import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'
import { CreateUserTownDto, UserTownDto } from '../dtos/UserTownDto'

export class CreateUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(dto: CreateUserTownDto): Promise<UserTownDto> {
    return await this.repo.create(dto)
  }
}
