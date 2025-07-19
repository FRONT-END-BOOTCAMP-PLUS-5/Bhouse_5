// backend/application/boardgames/usecases/SearchBoardgamesUseCase.ts

import { BoardgameRepository } from '@domain/repositories/BoardgameRepository'
import { SearchBoardgamesDto } from '../dtos/SearchBoardgamesDto'
import { BoardGameResponseDto } from '../dtos/BoardGameResponseDto'
import { Boardgame } from '@be/domain/entities/Boardgame' // Boardgame 엔티티 임포트

export class SearchBoardgamesUseCase {
  constructor(private readonly repo: BoardgameRepository) {}

  async execute(params: SearchBoardgamesDto): Promise<BoardGameResponseDto[]> {
    const boardgames = (await this.repo.searchBoardgames(params)) as (Boardgame & { likeCount: number })[] // likeCount 속성 추가된 타입으로 캐스팅

    return boardgames.map((game) => ({
      id: game.boardgameId,
      name: game.name,
      min_players: game.minPlayers ?? 0,
      max_players: game.maxPlayers ?? 0,
      img_url: game.imgUrl ?? '',
      like_count: game.likeCount, // repository에서 받아온 likeCount 사용
    }))
  }
}
