// backend/infrastructure/repositories/SupabaseUserSettingRepository.ts

import { supabaseClient } from '@be/utils/supabaseClient' // 미리 정의된 Supabase 클라이언트 임포트
import UserSettingRepository from '@domain/repositories/UserSettingRepository'
import { UserSetting } from '@domain/entities/UserSetting'
import { UserSettingTable } from '@infrastructure/types/database'

/**
 * UserSetting 엔티티와 Supabase 테이블 간의 매핑을 담당하는 Mapper 클래스입니다.
 */
class UserSettingMapper {
  /**
   * Supabase 테이블 데이터를 UserSetting 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 사용자 설정 테이블 데이터
   * @returns UserSetting 엔티티
   */
  static toUserSetting(data: UserSettingTable): UserSetting {
    return new UserSetting(data.user_id, data.keyword_alarm, data.reply_alarm)
  }

  /**
   * UserSetting 엔티티를 Supabase 테이블 데이터 형식으로 변환합니다.
   * @param userSetting UserSetting 엔티티
   * @returns Supabase에 저장할 사용자 설정 테이블 데이터
   */
  static toUserSettingTable(userSetting: UserSetting): UserSettingTable {
    // PK인 user_id도 포함하여 업데이트/삽입에 사용
    return {
      user_id: userSetting.userId,
      keyword_alarm: userSetting.keywordAlarm,
      reply_alarm: userSetting.replyAlarm,
    }
  }
}

/**
 * UserSettingRepository 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 데이터베이스와 상호작용합니다.
 */
export class SupabaseUserSettingRepository implements UserSettingRepository {
  constructor() {} // supabaseClient를 직접 사용하므로 생성자 인자 없음

  async findByUserId(userId: string): Promise<UserSetting | null> {
    const { data, error } = await supabaseClient
      .from('user_setting')
      .select('keyword_alarm, reply_alarm, user_id') // 필요한 컬럼만 선택
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null
      }
      console.error('Supabase findByUserId 에러:', error.message)
      throw new Error(`Failed to fetch user setting: ${error.message}`)
    }

    return data ? UserSettingMapper.toUserSetting(data) : null
  }

  async save(userSetting: UserSetting): Promise<UserSetting> {
    // user_id가 PK이므로 insert 시 충돌이 발생하면 update로 처리될 수 있도록 upsert 사용 고려
    // 또는 findByUserId로 먼저 조회 후 없으면 insert, 있으면 update 로직 분리
    // 현재 스키마는 user_id가 PK이므로 insert/update 모두 가능
    const { data, error } = await supabaseClient
      .from('user_setting')
      .insert([UserSettingMapper.toUserSettingTable(userSetting)])
      .select()
      .single()

    if (error) {
      // 이미 존재하는 경우 (unique constraint violation)
      if (error.code === '23505') {
        return this.update(userSetting) // 이미 존재하면 업데이트 시도
      }
      throw new Error(`Failed to save user setting: ${error.message}`)
    }
    return UserSettingMapper.toUserSetting(data)
  }

  async update(userSetting: UserSetting): Promise<UserSetting> {
    const { data, error } = await supabaseClient
      .from('user_setting')
      .update(UserSettingMapper.toUserSettingTable(userSetting))
      .eq('user_id', userSetting.userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user setting: ${error.message}`)
    }
    return UserSettingMapper.toUserSetting(data)
  }
}
