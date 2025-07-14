export interface LikeRepository {
  deleteLike(userId: string, boardgameId: number): unknown
  addLike(userId: string, boardgameId: number): Promise<void>
  getLikedBoardgames(userId: string): Promise<number[]>
}
