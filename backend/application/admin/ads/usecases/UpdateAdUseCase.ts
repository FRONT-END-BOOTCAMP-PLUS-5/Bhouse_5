import { AdRepository } from '../../../../domain/repositories/AdRepository'
import { UpdateAdDto } from '../dtos/UpdateAdDto'

export class UpdateAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(id: number, dto: UpdateAdDto): Promise<void> {
    await this.adRepo.update(id, dto)
  }
}
