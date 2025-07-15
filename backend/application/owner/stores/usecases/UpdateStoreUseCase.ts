import { StoreRepository } from '@be/domain/repositories/StoreRepository'
import { UpdateStoreDto } from '../dtos/UpdateStoreDto'

export class UpdateStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}

  async execute(storeId: number, updateData: UpdateStoreDto): Promise<void> {
    await this.storeRepo.update(storeId, updateData)
  }
}
