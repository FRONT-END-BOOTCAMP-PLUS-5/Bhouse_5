// backend/application/user/alarms/dtos/GetAlarmsQueryDto.ts

import { AlarmType } from "@domain/entities/Alarm";

/**
 * 특정 사용자의 알람을 조회하기 위한 쿼리 파라미터 DTO입니다.
 */
export interface GetAlarmsQueryDto {
  userId: string; // 사용자 ID (UUID)
  alarmType: AlarmType | "ALL"; // 알람 타입 ('ALL' 포함)
}