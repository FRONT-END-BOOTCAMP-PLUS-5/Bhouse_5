export interface BoardGameWithMetaResponseDto {
  id: number
  name: string
  img_url: string
  min_players: number
  max_players: number
  is_liked: boolean // 로그인한 유저 기준
  stores: {
    id: number
    name: string
  }[]
}
