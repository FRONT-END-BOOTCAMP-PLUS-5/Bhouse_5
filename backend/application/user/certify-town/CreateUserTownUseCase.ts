import { UserTownRepository } from "@be/domain/repositories/UserTownRepository";

export class CreateUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(userId: string, townName: string) {
    return await this.repo.create(userId, townName);
  }
}
