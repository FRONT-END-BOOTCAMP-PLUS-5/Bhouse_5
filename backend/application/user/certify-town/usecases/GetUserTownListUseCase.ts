import { UserTownRepository } from "@be/domain/repositories/UserTownRepository";

export class GetUserTownListUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(userId: string) {
    return this.repo.findByUserId(userId);
  }
}