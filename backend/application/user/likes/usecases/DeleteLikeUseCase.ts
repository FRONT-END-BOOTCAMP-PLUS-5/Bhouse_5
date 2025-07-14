import { LikeRepository } from '@domain/repositories/LikeRepository'

export class DeleteLikeUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute(userId: string, boardgameId: number): Promise<void> {
    await this.repo.deleteLike(userId, boardgameId)
  }
}
