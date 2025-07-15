import { UpdateAdDto } from '@be/application/admin/ads/dtos/UpdateAdDto'
import { Ad } from '../entities/Ad'
import { ReadAdDto } from '@be/application/admin/ads/dtos/ReadAdDto'
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto'

export type AdWithoutUserId = Omit<Ad, 'userId'>
export interface AdRepository {
  findById(id: number): Promise<ReadAdDto | null>
  findAll(): Promise<ReadAdDto[]>

  create(dto: CreateAdDto): Promise<void>
  update(id: number, dto: UpdateAdDto): Promise<void>
  delete(id: number): Promise<void>
}
