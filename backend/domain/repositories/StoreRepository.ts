import { Store } from "../entities/Store";

export interface StoreSearchParams {
  keyword?: string;
  address?: string;
  createdBy?: string; // 특정 유저의 매장만 보고 싶을 때
  ownerName?: string;
}

export interface StoreRepository {
  findById(id: number): Promise<Store | null>;
  findByUserId(userId: string): Promise<Store[]>;
  findByKeyword(keyword: StoreSearchParams): Promise<Store[]>;
  findAll(): Promise<Store[]>;
  create(ad: Store): Promise<void>;
  update(id: number, createdBy: string, updateData: Partial<Store>): Promise<void>;
  delete(id: number): Promise<void>;
}