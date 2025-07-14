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
  findById(id: number): Promise<ReadStoreDto | null>;
  findByUserId(userId: string): Promise<ReadStoreDto[]>;
  findByKeyword(keyword: StoreSearchParams): Promise<ReadStoreDto[]>;
  findAll(): Promise<ReadStoreDto[]>;

  create(store: CreateStoreDto): Promise<void>;
  update(id: number, createdBy: string, updateData: UpdateStoreDto): Promise<void>;

  delete(id: number): Promise<void>;
}
