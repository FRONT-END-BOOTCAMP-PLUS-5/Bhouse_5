import { LikedBoardgameDto } from '../dtos/LikedBoardgameDto'
import { LikeRepository } from '@be/domain/repositories/LikeRepository'

export class GetLikedBoardgamesUseCase {
  constructor(private readonly repo: LikeRepository) {}

  async execute(userId: string): Promise<LikedBoardgameDto[]> {
    const boardgames = (await this.repo.getLikedBoardgames(userId)) as unknown as LikedBoardgameDto[]

    return boardgames.map((game) => ({
      boardgameId: game.boardgameId,
      name: game.name,
      description: game.description ?? null,
      minPlayers: game.minPlayers ?? null,
      maxPlayers: game.maxPlayers ?? null,
      minPlaytime: game.minPlaytime ?? null,
      maxPlaytime: game.maxPlaytime ?? null,
      imgUrl: game.imgUrl ?? null,
    }))
  }
}
