import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'

export class VerifyUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(userId: string, townName: string, lat: number, lng: number) {
    const towns = await this.repo.findByUserId(userId)
    if (towns.length >= 3) {
      throw new Error('동네는 최대 3개까지 인증할 수 있습니다.')
    }

    if (towns.some((t) => t.townName === townName)) {
      throw new Error('이미 인증한 동네입니다.')
    }

    return await this.repo.create(userId, townName, lat, lng)
  }
}
