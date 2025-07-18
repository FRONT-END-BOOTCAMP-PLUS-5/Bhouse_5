// backend/application/user/alarms/dtos/MarkAlarmsAsReadDto.ts

/**
 * 알람 읽음 처리 요청을 위한 DTO입니다.
 * 특정 알람을 읽음 처리하거나 (alarmId), 모든 알람을 읽음 처리할 수 있습니다 (markAll).
 */
export interface MarkAlarmsAsReadDto {
  alarmId?: number // 특정 알람 ID (선택적)
  markAll?: boolean // 모든 알람 읽음 처리 여부 (선택적)
}
