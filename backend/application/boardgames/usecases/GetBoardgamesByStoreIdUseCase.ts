// application/usecases/GetStoreBoardgamesUseCase.ts
import BoardgameRepository from '@be/domain/repositories/BoardgameRepository'
import { BoardgameDTO } from '../dtos/BoardgameDto'

export class GetStoreBoardgamesUseCase {
  constructor(private boardgameRepository: BoardgameRepository) {}

  async execute(storeId: number): Promise<BoardgameDTO[]> {
    const boardgames = await this.boardgameRepository.findByStoreId(storeId)

    return boardgames.map((game) => ({
      id: game.boardgameId,
      title: game.name,
      imgUrl: game.imgUrl ?? '',
    }))
  }
}
