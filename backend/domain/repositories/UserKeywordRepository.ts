// backend/domain/repositories/UserKeywordRepository.ts

import { UserKeyword } from '../entities/UserKeyword'

/**
 * 사용자 커뮤니티 알림 키워드 데이터 접근을 위한 레포지토리 인터페이스입니다.
 * 도메인 계층은 이 추상화에 의존합니다.
 */
export default interface UserKeywordRepository {
  /**
   * 새로운 사용자 키워드를 저장합니다.
   * @param userKeyword 저장할 키워드 엔티티
   * @returns 저장된 키워드 엔티티
   */
  save(userKeyword: UserKeyword): Promise<UserKeyword>

  /**
   * 특정 사용자의 모든 키워드를 조회합니다.
   * @param userId 사용자 ID
   * @returns 사용자 키워드 배열
   */
  findByUserId(userId: string): Promise<UserKeyword[]>

  /**
   * 특정 키워드를 삭제합니다.
   * @param keywordId 키워드 ID
   * @param userId 사용자 ID (권한 확인용)
   */
  delete(keywordId: number, userId: string): Promise<void>
}
