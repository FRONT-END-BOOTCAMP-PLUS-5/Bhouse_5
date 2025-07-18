// backend/application/user/keywords/usecases/GetUserKeywordsUseCase.ts

import UserKeywordRepository from '@domain/repositories/UserKeywordRepository'
import { GetUserKeywordsQueryDto } from '../dtos/GetUserKeywordsQueryDto'
import { UserKeywordDto } from '../dtos/UserKeywordDto'

/**
 * 특정 사용자의 커뮤니티 알림 키워드 목록을 조회하는 유즈케이스입니다.
 */
export class GetUserKeywordsUseCase {
  private userKeywordRepository: UserKeywordRepository

  constructor(userKeywordRepository: UserKeywordRepository) {
    this.userKeywordRepository = userKeywordRepository
  }

  async execute(dto: GetUserKeywordsQueryDto): Promise<UserKeywordDto[]> {
    const userKeywords = await this.userKeywordRepository.findByUserId(dto.userId)

    return userKeywords.map((keyword) => ({
      keywordId: keyword.keywordId,
      userId: keyword.userId,
      keyword: keyword.keyword || '', // UserKeyword 엔티티에서 이미 string | null로 처리됨
      createdAt: keyword.createdAt.toISOString(),
    }))
  }
}
