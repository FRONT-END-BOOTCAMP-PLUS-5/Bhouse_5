// backend/application/user/settings/dtos/UserSettingResponseDto.ts

/**
 * 사용자 알림 설정 조회/업데이트 후 반환될 출력 DTO입니다.
 * 'Y'/'N' 문자열 값을 포함합니다.
 */
export interface UserSettingResponseDto {
  reply: 'Y' | 'N';
  keyword: 'Y' | 'N';
}