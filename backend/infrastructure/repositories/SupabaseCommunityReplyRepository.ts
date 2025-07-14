// backend/infrastructure/repositories/SupabaseCommunityReplyRepository.ts

import { supabaseClient } from '@be/utils/supabaseClient' // 미리 정의된 Supabase 클라이언트 임포트
import CommunityReplyRepository from '@domain/repositories/CommunityReplyRepository'
import { CommunityReply } from '@domain/entities/CommunityReply'
import { CommunityReplyTable } from '@infrastructure/types/database'

/**
 * CommunityReply 엔티티와 Supabase 테이블 간의 매핑을 담당하는 Mapper 클래스입니다.
 */
class CommunityReplyMapper {
  /**
   * Supabase 테이블 데이터를 CommunityReply 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 댓글 테이블 데이터
   * @returns CommunityReply 엔티티
   */
  static toCommunityReply(data: CommunityReplyTable): CommunityReply {
    return new CommunityReply(
      data.reply_id,
      data.post_id,
      data.user_id,
      data.content,
      data.parent_reply_id,
      new Date(data.created_at),
      new Date(data.updated_at),
    )
  }
}

/**
 * CommunityReplyRepository 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 데이터베이스와 상호작용합니다.
 */
export class SupabaseCommunityReplyRepository implements CommunityReplyRepository {
  constructor() {} // supabaseClient를 직접 사용하므로 생성자 인자 없음

  async findRepliesByUserId(userId: string): Promise<{ replies: CommunityReply[]; totalCount: number }> {
    const {
      data,
      error,
      count: totalCount,
    } = await supabaseClient
      .from('community_replies')
      .select(
        `
        reply_id,
        post_id,
        user_id,
        content,
        parent_reply_id,
        created_at,
        updated_at
      `,
        { count: 'exact' },
      ) // 필요한 필드만 명시적으로 선택
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // 최신순 정렬

    if (error) {
      console.error('Supabase replies query error:', error.message)
      throw new Error(`Failed to fetch user replies: ${error.message}`)
    }

    const replies: CommunityReply[] = (data ?? []).map((item: CommunityReplyTable) =>
      CommunityReplyMapper.toCommunityReply(item),
    )

    return {
      replies,
      totalCount: totalCount ?? 0,
    }
  }
}
