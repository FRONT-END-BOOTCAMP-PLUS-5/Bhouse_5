// 도메인 레이어 인터페이스
export interface StoreSearchParams {
  keyword?: string
  address?: string
  createdBy?: string
  ownerName?: string
}

export interface StoreRepository {
  getStoresByBoardgameId(boardgameId: number): Promise<{ storeId: string; storeName: string; address: string }[]>
}
