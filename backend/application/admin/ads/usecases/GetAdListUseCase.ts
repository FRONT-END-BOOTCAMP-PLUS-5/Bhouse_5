import { AdRepository } from '../../../../domain/repositories/AdRepository'
import { ReadAdDto } from '../dtos/ReadAdDto'

export class GetAdListUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(isAdmin: boolean): Promise<ReadAdDto[]> {
    const ads = await this.adRepo.findAll(isAdmin)
    return ads
  }
}
