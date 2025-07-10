// backend/domain/repositories/CommunityReplyRepository.ts

import { CommunityReply } from '../entities/CommunityReply'

/**
 * 커뮤니티 댓글 데이터 접근을 위한 레포지토리 인터페이스입니다.
 * 도메인 계층은 이 추상화에 의존합니다.
 */
export default interface CommunityReplyRepository {
  /**
   * 특정 사용자가 작성한 댓글 목록을 조회하고 총 개수를 반환합니다.
   * @param userId 사용자 ID (UUID)
   * @returns 댓글 배열과 총 개수
   */
  findRepliesByUserId(userId: string): Promise<{ replies: CommunityReply[]; totalCount: number }>

  // 필요한 경우 save, update, delete 등 다른 CRUD 메서드 추가
}
