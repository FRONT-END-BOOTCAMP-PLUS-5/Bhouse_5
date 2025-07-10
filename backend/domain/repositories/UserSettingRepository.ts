// backend/domain/repositories/UserSettingRepository.ts

import { UserSetting } from "../entities/UserSetting";

/**
 * 사용자 알림 설정 데이터 접근을 위한 레포지토리 인터페이스입니다.
 * 도메인 계층은 이 추상화에 의존합니다.
 */
export default interface UserSettingRepository {
  /**
   * 사용자 ID로 알림 설정을 조회합니다.
   * @param userId 사용자 ID (UUID)
   * @returns UserSetting 엔티티 또는 null (설정이 없는 경우)
   */
  findByUserId(userId: string): Promise<UserSetting | null>;

  /**
   * 사용자 알림 설정을 저장하거나 업데이트합니다.
   * (user_id가 PK이므로 upsert 개념으로 사용될 수 있음)
   * @param userSetting 저장/업데이트할 UserSetting 엔티티
   * @returns 저장/업데이트된 UserSetting 엔티티
   */
  save(userSetting: UserSetting): Promise<UserSetting>;

  /**
   * 사용자 알림 설정을 업데이트합니다.
   * @param userSetting 업데이트할 UserSetting 엔티티 (userId는 필수)
   * @returns 업데이트된 UserSetting 엔티티
   */
  update(userSetting: UserSetting): Promise<UserSetting>;
}