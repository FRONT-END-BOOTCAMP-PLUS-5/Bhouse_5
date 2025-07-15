import { StoreRepository } from '@be/domain/repositories/StoreRepository'

export class DeleteStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}

  async execute(storeId: number, createdBy: string): Promise<void> {
    await this.storeRepo.delete(storeId, createdBy)
  }
}
