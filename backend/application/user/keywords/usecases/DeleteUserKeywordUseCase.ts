// backend/application/user/keywords/usecases/DeleteUserKeywordUseCase.ts

import UserKeywordRepository from '@domain/repositories/UserKeywordRepository'
import { DeleteUserKeywordDto } from '../dtos/DeleteUserKeywordDto'

/**
 * 사용자 커뮤니티 알림 키워드를 삭제하는 유즈케이스입니다.
 */
export class DeleteUserKeywordUseCase {
  private userKeywordRepository: UserKeywordRepository

  constructor(userKeywordRepository: UserKeywordRepository) {
    this.userKeywordRepository = userKeywordRepository
  }

  async execute(dto: DeleteUserKeywordDto): Promise<void> {
    // 레포지토리의 delete 메서드를 호출하여 키워드 삭제
    await this.userKeywordRepository.delete(dto.keywordId, dto.userId)
  }
}
