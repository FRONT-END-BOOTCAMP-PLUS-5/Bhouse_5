// backend/domain/repositories/BoardgameRepository.ts

import { Boardgame } from "../entities/Boardgame";
import { BoardgameRelationsOptions } from "./options/BoardgameRelationsOptions"; // 아래에 정의될 옵션 파일

/**
 * 보드게임 데이터 접근을 위한 레포지토리 인터페이스입니다.
 * 도메인 계층은 이 추상화에 의존합니다.
 */
export default interface BoardgameRepository {
  /**
   * 새로운 보드게임을 저장합니다 (생성).
   * @param boardgame 저장할 보드게임 엔티티
   * @returns 저장된 보드게임 엔티티
   */
  save(boardgame: Boardgame): Promise<Boardgame>;

  /**
   * ID로 특정 보드게임을 조회합니다.
   * @param boardgameId 보드게임 ID
   * @param relations 관계 포함 옵션
   * @returns 보드게임 또는 null
   */
  findById(
    boardgameId: number,
    relations?: BoardgameRelationsOptions
  ): Promise<Boardgame | null>;

  /**
   * 모든 보드게임을 조회합니다.
   * @param relations 관계 포함 옵션
   * @returns 보드게임 배열
   */
  findAll(relations?: BoardgameRelationsOptions): Promise<Boardgame[]>;

  // 필요한 경우 update, delete 등 다른 CRUD 메서드 추가
}