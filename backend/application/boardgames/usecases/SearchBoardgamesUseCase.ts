import { BoardGame } from '@be/domain/entities/boardgame'
import { BoardgameRepository } from '@domain/repositories/BoardgameRepository'

export class SearchBoardgamesUseCase {
  constructor(private readonly repo: BoardgameRepository) {}

  async execute(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): Promise<BoardGame[]> {
    return this.repo.searchBoardgames(params)
  }
}
