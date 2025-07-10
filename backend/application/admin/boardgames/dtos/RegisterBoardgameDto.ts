// backend/application/admin/boardgames/dtos/RegisterBoardgameDto.ts

export interface RegisterBoardgameDto {
  userId: string; // created_by, updated_by 에 사용될 사용자 ID (UUID)
  korName: string; // name 컬럼에 매핑될 한국어 이름
  genreId: number;
  description?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minPlaytime?: number | null;
  maxPlaytime?: number | null;
  difficulty?: number | null;
  imgUrl?: string | null;
  // created_at, updated_at은 백엔드에서 처리 (updated_at은 DTO에 포함 가능)
}