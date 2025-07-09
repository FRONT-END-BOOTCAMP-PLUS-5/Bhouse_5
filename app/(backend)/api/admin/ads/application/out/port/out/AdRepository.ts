import { Ad } from "../../../../domain/model/Ad";

export interface AdRepository {
 findById(id: number): Promise<Ad | null>;
  findAll(): Promise<Ad[]>;
  create(ad: Ad): Promise<void>;
  update(ad: Ad): Promise<void>;
  delete(id: number): Promise<void>;
}