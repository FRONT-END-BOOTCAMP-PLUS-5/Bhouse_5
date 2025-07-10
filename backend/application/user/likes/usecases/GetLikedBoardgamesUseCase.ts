import { LikeRepository } from '@domain/repositories/LikeRepository'

export class GetLikedBoardgamesUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute(userId: string): Promise<number[]> {
    return await this.repo.getLikedBoardgames(userId)
  }
}
