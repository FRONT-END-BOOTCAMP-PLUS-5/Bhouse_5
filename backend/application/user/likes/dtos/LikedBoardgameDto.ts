export interface LikedBoardgameDto {
  boardgameId: number
  name: string
  description: string | null
  minPlayers: number | null
  maxPlayers: number | null
  minPlaytime: number | null
  maxPlaytime: number | null
  imgUrl: string | null
}
