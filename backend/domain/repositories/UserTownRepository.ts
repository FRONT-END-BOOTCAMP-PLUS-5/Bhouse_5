import { CreateUserTownDto, UserTownDto } from '@be/application/user/certify-town/dtos/UserTownDto'

export interface UserTownRepository {
  create(dto: CreateUserTownDto): Promise<UserTownDto>
  delete(dto: { id: number; userId: string }): Promise<void>
  findByUserId(userId: string): Promise<UserTownDto[]>
  setPrimary(userId: string, townId: number): Promise<void>
}
