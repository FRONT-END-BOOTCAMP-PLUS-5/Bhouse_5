import { Boardgame } from '../entities/Boardgame'

export interface BoardgameRepository {
  findBoardgameById(id: number): Promise<Boardgame | null>
  searchBoardgames(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): Boardgame[] | PromiseLike<Boardgame[]>
}
