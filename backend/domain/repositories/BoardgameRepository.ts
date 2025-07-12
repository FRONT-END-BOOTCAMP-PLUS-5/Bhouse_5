import { BoardGame } from '../entities/Boardgame'

export interface BoardgameRepository {
  findBoardgameById(id: number): Promise<BoardGame | null>
  searchBoardgames(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): BoardGame[] | PromiseLike<BoardGame[]>
}
