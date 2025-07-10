// backend/domain/repositories/CommunityPostRepository.ts

import { CommunityPost } from '../entities/CommunityPost'
import { CommunityCategory } from '../entities/CommunityCategory'

/**
 * 커뮤니티 게시글 데이터 접근을 위한 레포지토리 인터페이스입니다.
 * 도메인 계층은 이 추상화에 의존합니다.
 */
export default interface CommunityPostRepository {
  /**
   * 특정 사용자가 작성한 게시글 목록을 조회하고 총 개수를 반환합니다.
   * 카테고리 이름도 함께 가져와야 합니다.
   * @param userId 사용자 ID (UUID)
   * @returns 게시글 배열과 총 개수
   */
  findPostsByUserId(
    userId: string,
  ): Promise<{ posts: CommunityPost[]; totalCount: number; categories: CommunityCategory[] }>

  // 필요한 경우 save, update, delete 등 다른 CRUD 메서드 추가
}
