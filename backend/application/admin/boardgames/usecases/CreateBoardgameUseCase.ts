// backend/application/admin/boardgames/usecases/CreateBoardgameUseCase.ts

import BoardgameRepository from '@domain/repositories/BoardgameRepository'
import { Boardgame } from '@be/domain/entities/Boardgame'
import { CreateBoardgameDto } from '../dtos/CreateBoardgameDto'
import { CreatedBoardgameDto } from '../dtos/CreatedBoardgameDto'

/**
 * 새로운 보드게임을 등록하는 유즈케이스입니다.
 */
export class CreateBoardgameUseCase {
  private boardgameRepository: BoardgameRepository

  constructor(boardgameRepository: BoardgameRepository) {
    this.boardgameRepository = boardgameRepository
  }

  /**
   * 보드게임 등록을 실행합니다.
   * @param dto 보드게임 등록에 필요한 데이터를 담은 DTO
   * @returns 등록된 보드게임 정보를 담은 DTO
   */
  async execute(dto: CreateBoardgameDto): Promise<CreatedBoardgameDto> {
    // 1. DTO로부터 Boardgame 엔티티 객체 생성
    // boardgameId는 DB에서 자동 생성되므로 초기값은 0 또는 undefined로 설정
    // created_at은 DB 기본값 사용, updated_at은 현재 시간으로 설정
    const newBoardgame = new Boardgame(
      0, // boardgameId
      dto.korName, // name
      dto.userId, // createdBy
      dto.genreId,
      dto.description ?? null,
      dto.minPlayers ?? null,
      dto.maxPlayers ?? null,
      dto.minPlaytime ?? null,
      dto.maxPlaytime ?? null,
      dto.difficulty ?? null,
      dto.imgUrl ?? null,
      new Date(), // createdAt (DB 기본값 사용 시 제거 가능)
      new Date(), // updatedAt
      dto.userId, // updatedBy
    )

    // 2. BoardgameRepository를 통해 보드게임 저장
    const savedBoardgame = await (this.boardgameRepository as any).save(newBoardgame)

    // 3. 저장된 Boardgame 엔티티를 CreatedBoardgameDto로 변환하여 반환
    return {
      boardgameId: savedBoardgame.boardgameId,
      name: savedBoardgame.name,
      description: savedBoardgame.description,
      minPlayers: savedBoardgame.minPlayers,
      maxPlayers: savedBoardgame.maxPlayers,
      minPlaytime: savedBoardgame.minPlaytime,
      maxPlaytime: savedBoardgame.maxPlaytime,
      difficulty: savedBoardgame.difficulty,
      genreId: savedBoardgame.genreId,
      imgUrl: savedBoardgame.imgUrl,
      createdBy: savedBoardgame.createdBy,
      createdAt: savedBoardgame.createdAt.toISOString(),
      updatedAt: savedBoardgame.updatedAt.toISOString(),
      updatedBy: savedBoardgame.updatedBy,
    }
  }
}
