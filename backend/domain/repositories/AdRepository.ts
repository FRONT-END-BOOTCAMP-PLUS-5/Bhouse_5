import { UpdateAdDto } from '@be/application/admin/ads/dtos/UpdateAdDto'
import { Ad } from '../entities/Ad'
import { ReadAdDto } from '@be/application/admin/ads/dtos/ReadAdDto'
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto'

export type AdWithoutUserId = Omit<Ad, 'userId'>

export interface AdRepository {
  // isAdmin 여부는 route/controller에서 판단 후 전달
  findAll(isAdmin: boolean): Promise<ReadAdDto[]>

  // 비공개 광고 여부 판단은 repo 내부에서 하고, 외부에서 인증 여부 확인 후 사용할 수 있음
  findById(id: number): Promise<ReadAdDto | null>

  // 관리자 userId를 명시적으로 주입
  create(dto: CreateAdDto, userId: string): Promise<void>

  update(id: number, dto: UpdateAdDto): Promise<void>

  delete(id: number): Promise<void>
}
