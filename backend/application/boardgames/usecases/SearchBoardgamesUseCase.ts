// backend/application/boardgames/usecases/SearchBoardgamesUseCase.ts

import BoardgameRepository from '@domain/repositories/BoardgameRepository'
import { SearchBoardgamesDto } from '../dtos/SearchBoardgamesDto'
import { BoardGameResponseDto } from '../dtos/BoardGameResponseDto'

export class SearchBoardgamesUseCase {
  constructor(private readonly repo: BoardgameRepository) {}

  async execute(params: SearchBoardgamesDto): Promise<BoardGameResponseDto[]> {
    const boardgames = await this.repo.searchBoardgames(params)

    return boardgames.map((game) => ({
      id: game.boardgameId,
      name: game.name,
      min_players: game.minPlayers ?? 0,
      max_players: game.maxPlayers ?? 0,
      img_url: game.imgUrl ?? '',
    }))
  }
}
