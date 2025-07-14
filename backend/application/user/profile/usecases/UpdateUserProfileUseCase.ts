import { UserRepository } from '@domain/repositories/UserRepository'
import { User } from '@domain/entities/User'

export class UpdateUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, updateData: Partial<User>) {
    // 기존 유저 정보 조회
    const user = await this.userRepository.findById(userId)
    if (!user) throw new Error('User not found')

    // 변경값만 덮어쓰기
    Object.assign(user, updateData)

    // 저장
    return await this.userRepository.update(user)
  }
}
