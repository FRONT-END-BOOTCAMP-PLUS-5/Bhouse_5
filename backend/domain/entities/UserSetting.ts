// backend/domain/entities/UserSetting.ts

/**
 * 사용자 알림 설정 엔티티입니다.
 * 알림 설정의 핵심 데이터와 비즈니스 규칙을 캡슐화합니다.
 */
export class UserSetting {
  constructor(
    public userId: string, // UUID (Primary Key)
    public keywordAlarm: boolean,
    public replyAlarm: boolean,
  ) {}

  /**
   * 키워드 알림 설정을 토글합니다.
   */
  toggleKeywordAlarm(): void {
    this.keywordAlarm = !this.keywordAlarm
  }

  /**
   * 댓글 알림 설정을 토글합니다.
   */
  toggleReplyAlarm(): void {
    this.replyAlarm = !this.replyAlarm
  }

  /**
   * 알림 설정을 업데이트합니다.
   * @param newKeywordAlarm 새로운 키워드 알림 설정 (선택 사항)
   * @param newReplyAlarm 새로운 댓글 알림 설정 (선택 사항)
   */
  updateSettings(newKeywordAlarm?: boolean, newReplyAlarm?: boolean): void {
    if (newKeywordAlarm !== undefined) {
      this.keywordAlarm = newKeywordAlarm
    }
    if (newReplyAlarm !== undefined) {
      this.replyAlarm = newReplyAlarm
    }
  }
}
