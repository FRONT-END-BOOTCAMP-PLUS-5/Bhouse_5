import { LikeRepository } from '@domain/repositories/LikeRepository'

export class AddLikeUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute({ userId, boardgameId }: { userId: string; boardgameId: number }) {
    await this.repo.addLikedBoardgame(userId, boardgameId)
  }
}
