// backend/application/admin/alarms/dtos/CreatedAlarmDto.ts

import { AlarmType } from "@domain/entities/Alarm";

/**
 * 알람 생성 후 반환되는 데이터의 DTO 인터페이스입니다.
 * 클라이언트가 성공적으로 생성된 알람 정보를 받을 때 사용됩니다.
 */
export interface CreatedAlarmDto {
  alarmId: number;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  alarmType: AlarmType;
}