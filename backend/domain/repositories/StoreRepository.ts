import { CreateStoreDto } from '@be/application/owner/stores/dtos/CreatedStoreDto'
import { ReadStoreDto } from '@be/application/owner/stores/dtos/ReadStoreDto'
import { UpdateStoreDto } from '@be/application/owner/stores/dtos/UpdateStoreDto'

export interface StoreSearchParams {
  keyword?: string
  address?: string
  createdBy?: string
  ownerName?: string
}

export interface StoreRepository {
  getStoresByBoardgameId(boardgameId: number): Promise<{ storeId: string; storeName: string; address: string }[]>

  findById(id: number): Promise<ReadStoreDto | null>

  findByUserId(userId: string): Promise<ReadStoreDto[]>

  findByKeyword(params: StoreSearchParams): Promise<ReadStoreDto[]>

  findAll(): Promise<ReadStoreDto[]>

  create(dto: CreateStoreDto): Promise<void>

  update(id: number, dto: UpdateStoreDto): Promise<void>

  delete(id: number, createdBy: string, isAdmin: boolean): Promise<void>
}
