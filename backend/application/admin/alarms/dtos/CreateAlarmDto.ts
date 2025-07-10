// backend/application/admin/alarms/dto/CreateAlarmsDto.ts

import { AlarmType } from "@domain/entities/Alarm"; // AlarmType은 도메인 계층의 Alarm 엔티티에서 가져옵니다.

export interface CreateAlarmDto {
  userId: string; // 알람을 받을 사용자의 ID (UUID 형태)
  message: string; // 알람 메시지
  alarmType: AlarmType; // 알람 타입 (KEYWORD, REPLY, ADMIN 등)
  // isRead와 createdAt은 알람 생성 시점에 백엔드에서 기본값을 설정하므로 DTO에는 포함하지 않습니다.
  // user는 관계형 데이터이므로 DTO에 직접 포함하기보다 userId로 충분합니다.
}