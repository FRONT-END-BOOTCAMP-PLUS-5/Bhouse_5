export interface LikeRepository {
  addLike(userId: string, boardgameId: number): Promise<void>
  removeLike(userId: string, boardgameId: number): Promise<void>
  getLikedBoardgames(userId: string): Promise<number[]>
}
