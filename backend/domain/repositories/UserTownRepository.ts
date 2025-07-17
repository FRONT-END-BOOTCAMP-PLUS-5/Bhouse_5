import { CreateUserTownDto, UserTownDto } from '@be/application/user/certify-town/dtos/UserTownDto'

export interface UserTownRepository {
  create(dto: CreateUserTownDto): Promise<UserTownDto>
  delete(dto: { userId: string; townName: string }): Promise<void>
  findByUserId(userId: string): Promise<UserTownDto[]>
  setPrimary(userId: string, townName: string): Promise<void>
}
