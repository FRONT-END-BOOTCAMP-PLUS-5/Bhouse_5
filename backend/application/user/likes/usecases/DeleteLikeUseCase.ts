// backend/application/users/usecases/DeleteLikeUseCase.ts
import { LikeRepository } from '@be/domain/repositories/LikeRepository'

export class DeleteLikeUseCase {
  constructor(private readonly repo: LikeRepository) {}
  async execute(id: string, params: { userId: string; boardgameId: number }): Promise<void> {
    await this.repo.deleteLikedBoardgame(params.userId, params.boardgameId)
  }
}
