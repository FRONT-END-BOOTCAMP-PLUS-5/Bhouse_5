import { BoardGame } from '../entities/boardgame'

export interface BoardgameRepository {
  searchBoardgames(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): BoardGame[] | PromiseLike<BoardGame[]>
}
