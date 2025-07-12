import { BoardgameRepository } from '@domain/repositories/BoardgameRepository'
import { BoardgameDetailDto } from '../dtos/BoardgameDetailDto'
import { BoardGame } from '@domain/entities/Boardgame'

//TODO:like_count 추후 LikeRepository 통해 계산
// 현재는 0으로 고정

export class GetBoardgameByIdUseCase {
  constructor(private readonly repo: BoardgameRepository) {}

  async execute(boardgameId: number): Promise<BoardgameDetailDto | null> {
    const boardgame = await this.repo.findBoardgameById(boardgameId)
    if (!boardgame) return null

    return this.toDto(boardgame)
  }

  private toDto(boardgame: BoardGame): BoardgameDetailDto {
    return {
      name: boardgame.name ?? '',
      description: boardgame.description ?? '',
      genre_id: boardgame.genreId ?? 0,
      min_players: boardgame.minPlayers ?? 0,
      max_players: boardgame.maxPlayers ?? 0,
      min_playtime: boardgame.minPlayTime ?? 0,
      max_playtime: boardgame.maxPlayTime ?? 0,
      difficulty: boardgame.difficulty ?? 0,
      like_count: 0, // 추후 LikeRepository 통해 계산
    }
  }
}
