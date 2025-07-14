import { StoreRepository } from '@be/domain/repositories/StoreRepository'
import { Store } from '@be/domain/entities/Store'
import { ReadStoreDto } from '../dtos/ReadStoreDto'
import { Mapper } from '@be/infrastructure/mappers/Mapper'

export class GetStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}
  async execute(id: number): Promise<ReadStoreDto | null> {
    const store = await this.storeRepo.findById(id)
    return store ? Mapper.toReadStoreDto(store) : null
  }
}
