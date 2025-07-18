import { StoreRepository } from '@be/domain/repositories/StoreRepository'
import { CreateStoreDto } from '../dtos/CreatedStoreDto'
import { Mapper } from '@be/infrastructure/mappers/Mapper'

export class CreateStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}

  async execute(dto: CreateStoreDto, userId: string): Promise<void> {
    const store = Mapper.toStore(dto)
    await this.storeRepo.create(store, userId)
  }
}
