import { User } from '../entities/User'
import { UserRelationOptions } from './options/UserRelationOptions'

export interface UserRepository {
  // findAll(relations?: UserRelationOptions): Promise<User[]>

  deleteLikedBoardgame(userId: string, boardgameId: number): unknown
  addLikedBoardgame(userId: string, boardgameId: number): unknown
  getLikedBoardgames(userId: string): unknown
  findAll(relations?: UserRelationOptions): Promise<User[]>

  findById(id: string, relations?: UserRelationOptions): Promise<User | null>
  // save(user: User): Promise<User>
  update(user: User): Promise<User>
  // delete(id: string): Promise<void>
}
