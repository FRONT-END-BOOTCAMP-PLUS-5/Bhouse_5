// backend/infrastructure/repositories/SupabaseUserKeywordRepository.ts

import { supabaseClient } from "@be/utils/supabaseClient";
import UserKeywordRepository from "@domain/repositories/UserKeywordRepository";
import { UserKeyword } from "@domain/entities/UserKeyword";
import { UserCommunityAlarmKeywordTable } from "../types/database";

/**
 * UserKeyword 엔티티와 Supabase 테이블 간의 매핑을 담당하는 Mapper 클래스입니다.
 */
class UserKeywordMapper {
  /**
   * Supabase 테이블 데이터를 UserKeyword 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 키워드 테이블 데이터
   * @returns UserKeyword 엔티티
   */
  static toUserKeyword(data: UserCommunityAlarmKeywordTable): UserKeyword {
    return new UserKeyword(
      data.keyword_id,
      data.user_id,
      data.keyword, // 이제 keyword가 null일 수 있음
      new Date(data.created_at)
    );
  }

  /**
   * UserKeyword 엔티티를 Supabase 테이블 데이터 형식으로 변환합니다.
   * @param userKeyword UserKeyword 엔티티
   * @returns Supabase에 저장할 키워드 테이블 데이터
   */
  static toUserKeywordTable(
    userKeyword: UserKeyword
  ): Omit<UserCommunityAlarmKeywordTable, "keyword_id" | "created_at"> {
    return {
      user_id: userKeyword.userId,
      keyword: userKeyword.keyword, // 이제 keyword가 null일 수 있음
    };
  }
}

/**
 * UserKeywordRepository 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 데이터베이스와 상호작용합니다.
 */
export class SupabaseUserKeywordRepository implements UserKeywordRepository {
  constructor() {}

  async save(userKeyword: UserKeyword): Promise<UserKeyword> {
    const { data, error } = await supabaseClient
      .from("user_community_alarm_keywords")
      .insert([UserKeywordMapper.toUserKeywordTable(userKeyword)])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('이미 존재하는 키워드입니다.');
      }
      throw new Error(`Failed to save keyword: ${error.message}`);
    }
    return UserKeywordMapper.toUserKeyword(data);
  }

  async findByUserId(userId: string): Promise<UserKeyword[]> {
    const { data, error } = await supabaseClient
      .from("user_community_alarm_keywords")
      // created_at 필드 순서 변경에 따라 select 문자열도 업데이트
      .select("keyword_id, created_at, user_id, keyword")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch keywords: ${error.message}`);
    return (data ?? []).map((item: UserCommunityAlarmKeywordTable) => UserKeywordMapper.toUserKeyword(item));
  }

  async delete(keywordId: number, userId: string): Promise<void> {
    const { data, error } = await supabaseClient
      .from("user_community_alarm_keywords")
      .delete()
      .eq("keyword_id", keywordId)
      .eq("user_id", userId)
      .select();

    if (error) throw new Error(`Failed to delete keyword: ${error.message}`);
    if (!data || data.length === 0) {
        throw new Error('지정된 키워드를 찾을 수 없거나 삭제 권한이 없습니다.');
    }
  }
}