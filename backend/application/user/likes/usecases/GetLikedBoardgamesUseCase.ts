import { LikeRepository } from '@domain/repositories/LikeRepository'
import { LikedBoardgameDto } from '../dtos/LikedBoardgameDto'

export class GetLikedBoardgamesUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute(userId: string): Promise<LikedBoardgameDto[]> {
    const liked = await this.repo.getLikedBoardgames(userId)

    return liked.map((game) => ({
      boardgameId: game.boardgameId,
      name: game.name,
      description: game.description ?? null,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      minPlaytime: game.minPlaytime,
      maxPlaytime: game.maxPlaytime,
      imgUrl: game.imgUrl ?? null,
    }))
  }
}
