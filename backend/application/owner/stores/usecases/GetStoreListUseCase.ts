import { StoreRepository } from '@be/domain/repositories/StoreRepository'
import { Store } from '@be/domain/entities/Store'

export class GetStoreListUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}
  async execute(): Promise<Store[]> {
    return await this.storeRepo.findAll()
  }
}
