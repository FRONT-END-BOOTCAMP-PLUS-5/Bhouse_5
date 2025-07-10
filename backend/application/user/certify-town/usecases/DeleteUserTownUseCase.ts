import { UserTownRepository } from "@be/domain/repositories/UserTownRepository";

export class DeleteUserTownUseCase {
  constructor(private repo: UserTownRepository) {}

  async execute(id: number, userId: string): Promise<void> {
    await this.repo.delete(id, userId);
  }
}
