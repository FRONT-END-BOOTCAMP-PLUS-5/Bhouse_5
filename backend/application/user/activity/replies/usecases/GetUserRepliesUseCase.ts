// backend/application/user/activity/replies/usecases/GetUserRepliesUseCase.ts

import CommunityReplyRepository from '@domain/repositories/CommunityReplyRepository'
import { GetUserRepliesQueryDto } from '../dtos/GetUserRepliesQueryDto'
import { GetUserRepliesResponseDto, UserReplyResponseDto } from '../dtos/UserReplyResponseDto'

/**
 * 특정 사용자가 작성한 댓글 목록을 조회하는 유즈케이스입니다.
 */
export class GetUserRepliesUseCase {
  private communityReplyRepository: CommunityReplyRepository

  constructor(communityReplyRepository: CommunityReplyRepository) {
    this.communityReplyRepository = communityReplyRepository
  }

  /**
   * 사용자 ID를 통해 댓글 목록을 조회하고 DTO로 변환하여 반환합니다.
   * @param queryDto 조회 조건을 담은 DTO (userId)
   * @returns GetUserRepliesResponseDto (댓글 목록과 총 개수)
   */
  async execute(queryDto: GetUserRepliesQueryDto): Promise<GetUserRepliesResponseDto> {
    // 1. CommunityReplyRepository를 통해 데이터 조회
    const { replies, totalCount } = await this.communityReplyRepository.findRepliesByUserId(queryDto.userId)

    // 2. 조회된 CommunityReply 엔티티를 UserReplyResponseDto로 변환 및 가공
    const formattedReplies: UserReplyResponseDto[] = replies.map((reply) => ({
      reply_id: reply.replyId,
      text: reply.content,
      parent_reply_id: reply.parentReplyId,
      created_at: reply.createdAt.toISOString(), // Date 객체를 ISO 문자열로 변환
    }))

    // 3. 최종 응답 DTO 반환
    return {
      data: formattedReplies,
      total: totalCount,
    }
  }
}
