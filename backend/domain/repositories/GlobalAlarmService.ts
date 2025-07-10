// backend/domain/services/GlobalAlarmService.ts

import { AlarmType } from "../entities/Alarm";

/**
 * 전역 알람 발송 기능을 추상화한 인터페이스입니다.
 * 유즈케이스는 이 인터페이스에 의존합니다.
 */
export default interface GlobalAlarmService {
  sendGlobalAlarm(message: string, alarmType: AlarmType): Promise<void>;
}