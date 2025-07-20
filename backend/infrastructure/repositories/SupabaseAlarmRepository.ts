// backend/infrastructure/repositories/SupabaseAlarmRepository.ts

import { supabaseClient } from '@be/utils/supabaseClient' // 기존에 정의된 Supabase 클라이언트 인스턴스 임포트

import AlarmRepository from '@domain/repositories/AlarmRepository'
import { Alarm, AlarmType } from '@domain/entities/Alarm'
import { AlarmRelationsOptions } from '@domain/repositories/options/AlarmRelationsOptions'

// Supabase의 alarms 테이블에서 가져올 데이터의 타입 정의 (DB 스키마와 매핑)
interface AlarmTable {
  alarm_id: number
  user_id: string
  message: string
  is_read: boolean
  created_at: string // Supabase에서 가져올 때는 ISO 문자열
  alarm_type: AlarmType
  post_id: number | null // post_id 속성 추가
}

/**
 * Alarm 엔티티와 Supabase 테이블 간의 매핑을 담당하는 Mapper 클래스입니다.
 */
class AlarmMapper {
  /**
   * Supabase 테이블 데이터를 Alarm 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 알람 테이블 데이터
   * @returns Alarm 엔티티
   */
  static toAlarm(data: AlarmTable): Alarm {
    return new Alarm(
      data.alarm_id,
      data.user_id,
      data.message,
      data.is_read,
      new Date(data.created_at), // 문자열을 Date 객체로 변환
      data.alarm_type,
      data.post_id ?? undefined, // postId 매핑
    )
  }

  /**
   * Alarm 엔티티를 Supabase 테이블 데이터 형식으로 변환합니다.
   * @param alarm Alarm 엔티티
   * @returns Supabase에 저장할 알람 테이블 데이터
   */
  static toAlarmTable(alarm: Alarm): Omit<AlarmTable, 'alarm_id' | 'created_at'> & { created_at?: string } {
    return {
      user_id: alarm.userId,
      message: alarm.message,
      is_read: alarm.isRead,
      alarm_type: alarm.alarmType,
      post_id: alarm.postId ?? null, // postId 매핑
      // created_at은 DB에서 기본값으로 설정되거나, 엔티티의 값을 사용 (insert 시)
      created_at: alarm.createdAt ? alarm.createdAt.toISOString() : undefined,
    }
  }
}

/**
 * AlarmRepository 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 데이터베이스와 상호작용합니다.
 */
export class SupabaseAlarmRepository implements AlarmRepository {
  constructor() {
    // 생성자에서 SupabaseClient를 주입받는 대신, 미리 정의된 인스턴스를 직접 사용
  }

  async findAll(relations?: AlarmRelationsOptions): Promise<Alarm[]> {
    const query = supabaseClient.from('alarms').select('*') // supabaseClient 사용
    // 관계 포함 로직 (필요시 구현)
    const { data, error } = await query
    if (error) throw new Error(`Failed to fetch all alarms: ${error.message}`)
    return (data ?? []).map((item: AlarmTable) => AlarmMapper.toAlarm(item)) // item 타입 명시
  }

  async findById(alarmId: number, relations?: AlarmRelationsOptions): Promise<Alarm | null> {
    const query = supabaseClient // supabaseClient 사용
      .from('alarms')
      .select('*')
      .eq('alarm_id', alarmId)
      .single()
    // 관계 포함 로직 (필요시 구현)
    const { data, error } = await query
    if (error) {
      if (error.code === 'PGRST116') return null // No rows found
      throw new Error(`Failed to fetch alarm by ID: ${error.message}`)
    }
    return data ? AlarmMapper.toAlarm(data) : null
  }

  async findByUserId(userId: string, relations?: AlarmRelationsOptions): Promise<Alarm[]> {
    const query = supabaseClient // supabaseClient 사용
      .from('alarms')
      .select('*')
      .eq('user_id', userId)
    // 관계 포함 로직 (필요시 구현)
    const { data, error } = await query
    if (error) throw new Error(`Failed to fetch alarms by user ID: ${error.message}`)
    return (data ?? []).map((item: AlarmTable) => AlarmMapper.toAlarm(item)) // item 타입 명시
  }

  async save(alarm: Alarm): Promise<Alarm> {
    const { data, error } = await supabaseClient // supabaseClient 사용
      .from('alarms')
      .insert([AlarmMapper.toAlarmTable(alarm)])
      .select()
      .single()
    if (error) throw new Error(`Failed to save alarm: ${error.message}`)
    return AlarmMapper.toAlarm(data)
  }

  async update(alarm: Alarm): Promise<Alarm> {
    const { data, error } = await supabaseClient // supabaseClient 사용
      .from('alarms')
      .update(AlarmMapper.toAlarmTable(alarm))
      .eq('alarm_id', alarm.alarmId)
      .select()
      .single()
    if (error) throw new Error(`Failed to update alarm: ${error.message}`)
    return AlarmMapper.toAlarm(data)
  }

  async delete(alarmId: number): Promise<void> {
    const { error } = await supabaseClient // supabaseClient 사용
      .from('alarms')
      .delete()
      .eq('alarm_id', alarmId)
    if (error) throw new Error(`Failed to delete alarm: ${error.message}`)
  }

  async markAsRead(alarmId: number): Promise<void> {
    const { error } = await supabaseClient // supabaseClient 사용
      .from('alarms')
      .update({ is_read: true })
      .eq('alarm_id', alarmId)
    if (error) throw new Error(`Failed to mark alarm as read: ${error.message}`)
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabaseClient // supabaseClient 사용
      .from('alarms')
      .update({ is_read: true })
      .eq('user_id', userId) // 사용자 ID에 해당하는 모든 알람을 읽음 처리
    if (error) throw new Error(`Failed to mark all alarms as read for user ${userId}: ${error.message}`)
  }

  async findByUserIdAndType(
    userId: string,
    alarmType: AlarmType | 'ALL',
  ): Promise<{ alarms: Alarm[]; totalCount: number }> {
    let query = supabaseClient // supabaseClient 사용
      .from('alarms')
      .select('alarm_id, user_id, alarm_type, message, is_read, created_at, post_id', { count: 'exact' }) // <-- post_id 추가
      .eq('user_id', userId)

    if (alarmType !== 'ALL') {
      query = query.eq('alarm_type', alarmType)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase 쿼리 에러:', error.message)
      throw new Error(`Failed to fetch alarms: ${error.message}`)
    }

    const alarms: Alarm[] = (data ?? []).map((item: AlarmTable) => AlarmMapper.toAlarm(item))
    const totalCount: number = count ?? 0

    return { alarms, totalCount }
  }
}
