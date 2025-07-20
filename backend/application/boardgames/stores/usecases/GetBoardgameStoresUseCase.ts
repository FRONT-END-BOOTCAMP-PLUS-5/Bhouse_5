// GetBoardgameStoresUseCase.ts
import { StoreRepository } from '@domain/repositories/StoreRepository'
import { BoardgameStoreDto } from '../dtos/BoardgameStoreDto'

export class GetBoardgameStoresUseCase {
  constructor(private readonly repo: StoreRepository) {}

  async execute(boardgameId: number): Promise<BoardgameStoreDto[]> {
    console.log('boardgameId', boardgameId)
    const stores = await this.repo.getStoresByBoardgameId(boardgameId)
    console.log(stores)
    stores.map((store) => {
      console.log('store', store)
    })
    // 만약 추가 데이터 가공이 필요하다면 여기서 처리
    return stores.map((store) => ({
      storeId: store.storeId,
      storeName: store.storeName,
      address: store.address,
    }))
  }
}
