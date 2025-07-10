import { UserTownRepository } from "@be/domain/repositories/UserTownRepository";

export class CreateUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(userId: string, townName: string, lat: number, lng: number) {
    return await this.repo.create(userId, townName, lat, lng);
  }
}
