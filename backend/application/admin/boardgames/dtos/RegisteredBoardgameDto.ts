// backend/application/admin/boardgames/dtos/RegisteredBoardgameDto.ts

export interface RegisteredBoardgameDto {
  boardgameId: number
  name: string
  description: string | null
  minPlayers: number | null
  maxPlayers: number | null
  minPlaytime: number | null
  maxPlaytime: number | null
  difficulty: number | null
  genreId: number
  imgUrl: string | null
  createdBy: string
  createdAt: string // ISO 8601 문자열
  updatedAt: string // ISO 8601 문자열
  updatedBy: string
}
