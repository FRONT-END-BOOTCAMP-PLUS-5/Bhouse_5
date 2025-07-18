import { Boardgame } from '../entities/Boardgame'

export default interface BoardgameRepository {
  findBoardgameById(id: number): Promise<Boardgame | null>
  searchBoardgames(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): Boardgame[] | PromiseLike<Boardgame[]>
  findByStoreId(storeId: number): Promise<Boardgame[]>
}
