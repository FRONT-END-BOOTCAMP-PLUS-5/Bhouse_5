// backend/domain/entities/Alarm.ts

import { User } from './User' // User 엔티티가 있다면 임포트 (없다면 User 엔티티도 정의 필요)

/**
 * 알람 타입을 정의하는 Enum입니다.
 * 도메인 계층에 정의하여 비즈니스 로직의 일관성을 유지합니다.
 */
export enum AlarmType {
  TYPE1 = 'KEYWORD',
  TYPE2 = 'REPLY',
  TYPE3 = 'ADMIN',
}
export class Alarm {
  constructor(
    public alarmId: number,
    public userId: string, // uuid
    public message: string,
    public isRead: boolean = false, // 기본값 설정
    public createdAt: Date = new Date(), // 기본값 설정
    public alarmType: AlarmType,
    public user?: User, // N:1 관계 (User 엔티티가 있다면)
  ) {}

  /**
   * 알람을 읽음 상태로 변경합니다.
   */
  markAsRead(): void {
    this.isRead = true
  }
}
