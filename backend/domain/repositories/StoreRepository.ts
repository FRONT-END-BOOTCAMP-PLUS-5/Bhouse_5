import { ReadStoreDto } from '@be/application/owner/stores/dtos/ReadStoreDto'
import { CreateStoreDto } from '@be/application/owner/stores/dtos/CreatedStoreDto'
import { UpdateStoreDto } from '@be/application/owner/stores/dtos/UpdateStoreDto'

export interface StoreSearchParams {
  keyword?: string
  address?: string
  createdBy?: string // 특정 유저의 매장만 보고 싶을 때
  ownerName?: string
}

export interface StoreRepository {
  getStoresByBoardgameId(boardgameId: number): Promise<{ storeId: string; storeName: string; address: string }[]>
  findById(id: number): Promise<Store | null>
  findByUserId(userId: string): Promise<Store[]>
  findByKeyword(keyword: StoreSearchParams): Promise<Store[]>
  findAll(): Promise<Store[]>
  create(ad: Store): Promise<void>
  update(id: number, createdBy: string, updateData: Partial<Store>): Promise<void>
  delete(id: number): Promise<void>
}
