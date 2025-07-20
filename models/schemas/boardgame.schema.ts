export interface BoardGameWithMeta {
  id: number
  name: string
  img_url: string
  min_players: number
  max_players: number
  isLiked: boolean
  stores: {
    id: number
    name: string
  }[]
}
