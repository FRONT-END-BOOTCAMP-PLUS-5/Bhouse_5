import { BoardgameRepository } from '@be/domain/repositories/BoardgameRepository'

export class GetBoardgameStoresUseCase {
  constructor(private readonly repo: BoardgameRepository) {}

  async execute(boardgameId: number): Promise<{ storeId: string; storeName: string; address: string }[]> {
    return this.repo.getStoresByBoardgameId(boardgameId)
  }
}
