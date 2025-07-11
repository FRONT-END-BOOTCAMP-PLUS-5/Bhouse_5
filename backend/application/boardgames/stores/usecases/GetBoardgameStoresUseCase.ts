import { StoreRepository } from '@domain/repositories/StoreRepository'

export class GetBoardgameStoresUseCase {
  constructor(private readonly repo: StoreRepository) {}

  async execute(boardgameId: number): Promise<{ storeId: string; storeName: string; address: string }[]> {
    return this.repo.getStoresByBoardgameId(boardgameId)
  }
}
