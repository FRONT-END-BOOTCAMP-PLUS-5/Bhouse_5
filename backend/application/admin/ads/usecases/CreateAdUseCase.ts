import { AdRepository } from '../../../../domain/repositories/AdRepository'
import { CreateAdDto } from '../dtos/CreatedAdDto'

export class CreateAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(dto: CreateAdDto, userId: string): Promise<void> {
    await this.adRepo.create(dto, userId)
  }
}
