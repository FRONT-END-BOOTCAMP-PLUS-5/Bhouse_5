export interface BoardgameListPageDTO {
  id: number
  title: string
  imgUrl: string
  isLiked: boolean // 현재 유저가 찜했는지 여부
  stores: {
    id: number
    name: string
  }[]
}
