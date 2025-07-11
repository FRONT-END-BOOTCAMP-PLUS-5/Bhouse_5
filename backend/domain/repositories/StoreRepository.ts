export interface StoreRepository {
  getStoresByBoardgameId(boardgameId: number): Promise<{ storeId: string; storeName: string; address: string }[]>
}
