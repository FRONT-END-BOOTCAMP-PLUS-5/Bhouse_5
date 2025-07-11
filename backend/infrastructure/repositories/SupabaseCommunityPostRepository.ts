// backend/infrastructure/repositories/SupabaseCommunityPostRepository.ts

import { supabaseClient } from '@be/utils/supabaseClient' // 미리 정의된 Supabase 클라이언트 임포트
import CommunityPostRepository from '@domain/repositories/CommunityPostRepository'
import { CommunityPost } from '@domain/entities/CommunityPost'
import { CommunityCategory } from '@domain/entities/CommunityCategory'
import { CommunityPostTable, CommunityCategoryTable } from '@infrastructure/types/database'

/**
 * CommunityPost 엔티티와 Supabase 테이블 간의 매핑을 담당하는 Mapper 클래스입니다.
 */
class CommunityPostMapper {
  /**
   * Supabase 테이블 데이터를 CommunityPost 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 게시글 테이블 데이터
   * @returns CommunityPost 엔티티
   */
  static toCommunityPost(data: CommunityPostTable): CommunityPost {
    return new CommunityPost(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.category_id,
      data.town,
      Number(data.hits), // bigint가 number로 변환될 수 있도록 명시적 캐스팅
    )
  }

  /**
   * Supabase 테이블 데이터를 CommunityCategory 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 카테고리 테이블 데이터
   * @returns CommunityCategory 엔티티
   */
  static toCommunityCategory(data: CommunityCategoryTable): CommunityCategory {
    return new CommunityCategory(data.id, data.name)
  }
}

/**
 * CommunityPostRepository 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 데이터베이스와 상호작용합니다.
 */
export class SupabaseCommunityPostRepository implements CommunityPostRepository {
  constructor() {} // supabaseClient를 직접 사용하므로 생성자 인자 없음

  async findPostsByUserId(
    userId: string,
  ): Promise<{ posts: CommunityPost[]; totalCount: number; categories: CommunityCategory[] }> {
    // 1. 게시글 데이터 조회
    // 카테고리 이름도 함께 가져오기 위해 JOIN 또는 별도 쿼리 필요
    // Supabase의 .select()는 JOIN된 관계를 가져올 수 있습니다.
    // 'community_category(id, name)'은 community_category 테이블의 id와 name 필드를 가져옴
    const {
      data: postsData,
      error: postsError,
      count: totalCount,
    } = await supabaseClient
      .from('community_posts')
      .select(
        `
        post_id,
        user_id,
        title,
        content,
        created_at,
        updated_at,
        category_id,
        town,
        hits
      `,
        { count: 'exact' },
      ) // 필요한 필드만 명시적으로 선택
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // 최신순 정렬

    if (postsError) {
      console.error('Supabase posts query error:', postsError.message)
      throw new Error(`Failed to fetch user posts: ${postsError.message}`)
    }

    // 2. 카테고리 데이터 조회 (모든 카테고리를 가져와 매핑에 사용)
    const { data: categoriesData, error: categoriesError } = await supabaseClient
      .from('community_category')
      .select('id, name')

    if (categoriesError) {
      console.error('Supabase categories query error:', categoriesError.message)
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }

    const posts: CommunityPost[] = (postsData ?? []).map((item: CommunityPostTable) =>
      CommunityPostMapper.toCommunityPost(item),
    )
    const categories: CommunityCategory[] = (categoriesData ?? []).map((item: CommunityCategoryTable) =>
      CommunityPostMapper.toCommunityCategory(item),
    )

    return {
      posts,
      totalCount: totalCount ?? 0,
      categories,
    }
  }
}
