import { LikeRepository } from '@domain/repositories/LikeRepository'

export class AddLikeUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute(userId: string, boardgameId: number): Promise<void> {
    await this.repo.addLike(userId, boardgameId)
  }
}
