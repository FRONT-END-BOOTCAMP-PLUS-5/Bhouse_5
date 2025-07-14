// backend/domain/repositories/AlarmRepository.ts

import { Alarm, AlarmType } from '../entities/Alarm'
import { AlarmRelationsOptions } from './options/AlarmRelationsOptions' // 아래에 정의될 옵션 파일

export default interface AlarmRepository {
  /**
   * 모든 알람을 조회합니다.
   * @param relations 관계 포함 옵션
   * @returns 알람 배열
   */
  findAll(relations?: AlarmRelationsOptions): Promise<Alarm[]>

  /**
   * ID로 특정 알람을 조회합니다.
   * @param alarmId 알람 ID
   * @param relations 관계 포함 옵션
   * @returns 알람 또는 null
   */
  findById(alarmId: number, relations?: AlarmRelationsOptions): Promise<Alarm | null>

  /**
   * 사용자 ID로 알람 목록을 조회합니다.
   * @param userId 사용자 ID (UUID)
   * @param relations 관계 포함 옵션
   * @returns 해당 사용자의 알람 배열
   */
  findByUserId(userId: string, relations?: AlarmRelationsOptions): Promise<Alarm[]>

  /**
   * 알람을 저장합니다 (생성 또는 업데이트).
   * @param alarm 저장할 알람 엔티티
   * @returns 저장된 알람 엔티티
   */
  save(alarm: Alarm): Promise<Alarm>

  /**
   * 알람을 업데이트합니다.
   * @param alarm 업데이트할 알람 엔티티
   * @returns 업데이트된 알람 엔티티
   */
  update(alarm: Alarm): Promise<Alarm>

  /**
   * ID로 알람을 삭제합니다.
   * @param alarmId 삭제할 알람 ID
   */
  delete(alarmId: number): Promise<void>

  /**
   * 특정 알람을 읽음 상태로 표시합니다.
   * @param alarmId 읽음 처리할 알람 ID
   */
  markAsRead(alarmId: number): Promise<void>

  /**
   * 사용자 ID와 알람 타입으로 알람 목록 및 총 개수를 조회합니다.
   * 기존 route.ts의 `GET` 요청 로직에 맞춰 추가된 메서드입니다.
   * @param userId 사용자 ID (UUID)
   * @param alarmType 알람 타입 (KEYWORD, REPLY, ADMIN, ALL)
   * @returns 알람 배열과 총 개수
   */
  findByUserIdAndType(userId: string, alarmType: AlarmType | 'ALL'): Promise<{ alarms: Alarm[]; totalCount: number }>
}
