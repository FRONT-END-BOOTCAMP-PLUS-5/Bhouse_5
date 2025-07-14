import { UpdateAdDto } from '@be/application/admin/ads/dtos/UpdateAdDto'
import { Ad } from '../entities/Ad'

export type AdWithoutUserId = Omit<Ad, 'userId'>
export interface AdRepository {
  findById(id: number): Promise<Ad | null>
  findAll(): Promise<Ad[]>
  create(ad: Ad): Promise<void>
 update(id: number, dto: UpdateAdDto): Promise<void>;
  delete(id: number): Promise<void>
}
