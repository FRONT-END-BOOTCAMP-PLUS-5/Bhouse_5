// backend/domain/repositories/LikeRepository.ts
import { BoardGame } from '@domain/entities/Boardgame'

export interface LikeRepository {
  addLikedBoardgame(userId: string, boardgameId: number): Promise<void>
  deleteLikedBoardgame(userId: string, boardgameId: number): Promise<void>
  getLikedBoardgames(userId: string): Promise<BoardGame[]>
}
