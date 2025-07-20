import { StoreRepository } from '@be/domain/repositories/StoreRepository'

export class DeleteStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}

  async execute(storeId: number, createdBy: string, userId: string, isAdmin: boolean): Promise<void> {
    await this.storeRepo.delete(storeId, userId, isAdmin ? 'ADMIN' : 'USER')
  }
}
