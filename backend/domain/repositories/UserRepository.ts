import { User } from '../entities/User'
import { UserRelationOptions } from './options/UserRelationOptions'

export interface UserRepository {
  findById(id: string, relations?: UserRelationOptions): Promise<User | null>
  // save(user: User): Promise<User>
  update(user: User): Promise<User>
  // delete(id: string): Promise<void>

  // 닉네임 중복 체크 메서드
  checkNicknameExists(nickname: string, excludeUserId?: string): Promise<boolean>
  getPrimaryTownByUserId(userId: string): Promise<string | null>
}
