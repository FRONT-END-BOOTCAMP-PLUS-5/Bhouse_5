// backend/application/user/settings/dtos/UpdateUserSettingDto.ts

/**
 * 사용자 알림 설정을 업데이트하기 위한 입력 DTO입니다.
 * 'Y'/'N' 문자열 값을 받습니다.
 */
export interface UpdateUserSettingDto {
  userId: string; // 사용자 ID (UUID)
  reply?: 'Y' | 'N'; // 댓글 알림 설정 ('Y' 또는 'N')
  keyword?: 'Y' | 'N'; // 키워드 알림 설정 ('Y' 또는 'N')
}