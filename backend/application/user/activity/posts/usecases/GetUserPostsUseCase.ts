// backend/application/user/activity/posts/usecases/GetUserPostsUseCase.ts

import CommunityPostRepository from '@domain/repositories/CommunityPostRepository'
import { GetUserPostsQueryDto } from '../dtos/GetUserPostsQueryDto'
import { GetUserPostsResponseDto, UserPostResponseDto } from '../dtos/UserPostResponseDto'
import { CommunityCategory } from '@domain/entities/CommunityCategory'

/**
 * 특정 사용자가 작성한 게시글 목록을 조회하는 유즈케이스입니다.
 */
export class GetUserPostsUseCase {
  private communityPostRepository: CommunityPostRepository

  constructor(communityPostRepository: CommunityPostRepository) {
    this.communityPostRepository = communityPostRepository
  }

  /**
   * 사용자 ID를 통해 게시글 목록을 조회하고 DTO로 변환하여 반환합니다.
   * @param queryDto 조회 조건을 담은 DTO (userId)
   * @returns GetUserPostsResponseDto (게시글 목록과 총 개수)
   */
  async execute(queryDto: GetUserPostsQueryDto): Promise<GetUserPostsResponseDto> {
    // 1. CommunityPostRepository를 통해 데이터 조회
    const { posts, totalCount, categories } = await this.communityPostRepository.findPostsByUserId(queryDto.userId)

    // 카테고리 ID를 이름으로 매핑하기 위한 맵 생성
    const categoryMap = new Map<number, string>()
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.name)
    })

    // 2. 조회된 CommunityPost 엔티티를 UserPostResponseDto로 변환 및 가공
    const formattedPosts: UserPostResponseDto[] = posts.map((post) => ({
      id: post.postId,
      title: post.title,
      hits: post.hits,
      category: categoryMap.get(post.categoryId) || '알 수 없음', // 카테고리 이름 매핑
      createdAt: post.createdAt.toISOString(), // Date 객체를 ISO 문자열로 변환
    }))

    // 3. 최종 응답 DTO 반환
    return {
      data: formattedPosts,
      total: totalCount,
    }
  }
}
