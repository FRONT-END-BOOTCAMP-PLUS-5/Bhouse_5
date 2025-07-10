// backend/domain/entities/Boardgame.ts

import { User } from "./User";
import { BoardgameGenre } from "./BoardgameGenre";

/**
 * 보드게임 엔티티입니다.
 * 보드게임의 핵심 데이터와 비즈니스 규칙을 캡슐화합니다.
 */
export class Boardgame {
  constructor(
    public boardgameId: number,
    public name: string, // kor_name에 해당
    public createdBy: string, // user_id에 해당 (UUID)
    public genreId: number,
    public description: string | null = null,
    public minPlayers: number | null = null,
    public maxPlayers: number | null = null,
    public minPlaytime: number | null = null,
    public maxPlaytime: number | null = null,
    public difficulty: number | null = null, // real 타입 (float)
    public imgUrl: string | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public updatedBy: string, // user_id에 해당 (UUID)
    // 관계
    public creator?: User, // N:1 관계
    public updater?: User, // N:1 관계
    public genre?: BoardgameGenre // N:1 관계
  ) {}

  // 엔티티 관련 비즈니스 로직 메서드 추가 가능 (예: validateFields, updateDifficulty 등)
}