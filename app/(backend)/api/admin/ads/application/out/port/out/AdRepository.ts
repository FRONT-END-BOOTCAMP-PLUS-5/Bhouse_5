import { Ad } from "../../../../domain/model/Ad";

export type AdWithoutUserId = Omit<Ad, 'userId'>;
export interface AdRepository {
  findById(id: number): Promise<Ad | null>;
  findAll(): Promise<Ad[]>;
  create(ad: Ad): Promise<void>;
  update(id: number, updateData: Partial<Ad>): Promise<void>;
  delete(id: number): Promise<void>;
}