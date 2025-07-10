// backend/application/admin/alarms/dtos/SendGlobalAlarmDto.ts

import { AlarmType } from "@domain/entities/Alarm";

/**
 * 전역 알람 발송에 필요한 데이터의 DTO 인터페이스입니다.
 */
export interface SendGlobalAlarmDto {
  message: string;
  alarmType: AlarmType;
}