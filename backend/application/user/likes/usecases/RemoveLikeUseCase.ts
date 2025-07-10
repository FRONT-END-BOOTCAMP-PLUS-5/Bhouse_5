import { LikeRepository } from '@domain/repositories/LikeRepository'

export class RemoveLikeUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute(userId: string, boardgameId: number): Promise<void> {
    await this.repo.removeLike(userId, boardgameId)
  }
}
