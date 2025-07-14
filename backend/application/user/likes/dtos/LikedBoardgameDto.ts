export interface LikedBoardgameDto {
  boardgameId: number
  name: string
  imgUrl: string | null
  minPlayers?: number | null
  maxPlayers?: number | null
  minPlaytime?: number | null
  maxPlaytime?: number | null
  difficulty?: number | null
}
