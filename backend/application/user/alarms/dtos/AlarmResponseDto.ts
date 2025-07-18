// backend/application/user/alarms/dtos/AlarmResponseDto.ts

import { AlarmType } from '@domain/entities/Alarm'

/**
 * 알람 조회 결과로 반환되는 개별 알람 데이터의 DTO입니다.
 * 기존 route.ts의 응답 형식에 맞춰 'title' 필드를 조건부로 포함합니다.
 */
export interface AlarmResponseDto {
  id: number // 알림 ID
  type: AlarmType // 알림 타입
  is_read: boolean // 읽음 여부
  created_at: string // 생성 시간 (ISO 8601 문자열)
  message?: string // 'reply' 타입이 아닐 경우 사용
  title?: string // 'reply' 타입일 경우 사용
  post_id?: number // postId 속성 추가
}

/**
 * 알람 목록 조회 결과로 반환되는 전체 응답 DTO입니다.
 */
export interface GetAlarmsResponseDto {
  alarms: AlarmResponseDto[]
  totalCount: number
}
