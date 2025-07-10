// backend/application/user/settings/dtos/GetUserSettingQueryDto.ts

/**
 * 사용자 알림 설정을 조회하기 위한 쿼리 DTO입니다.
 */
export interface GetUserSettingQueryDto {
  userId: string; // 사용자 ID (UUID)
}