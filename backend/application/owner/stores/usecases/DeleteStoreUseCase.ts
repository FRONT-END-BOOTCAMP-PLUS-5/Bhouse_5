import { StoreRepository } from '@be/domain/repositories/StoreRepository'

export class DeleteStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}
  async execute(id: number): Promise<void> {
    await this.storeRepo.delete(id)
  }
}
