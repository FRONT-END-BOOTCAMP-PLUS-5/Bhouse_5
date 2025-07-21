// models/services/setting.service.ts
import instance from '@utils/instance' // Axios 인스턴스 경로 확인

// API 응답 타입 정의 (필요에 따라 더 구체화)
interface ApiResponse<T> {
  success: boolean
  settings: T // [수정] settings 필드로 변경
}

// 사용자 설정 데이터 타입
export interface UserSettings {
  reply: 'Y' | 'N'
  keyword: 'Y' | 'N'
  // 여기에 다른 설정들이 있다면 추가
}

const PATH = '/api/user/settings' // API URL 경로

/**
 * 현재 사용자 설정을 가져오는 서비스 함수
 * @returns Promise<UserSettings>
 */
export const getUserSettingsService = async (): Promise<UserSettings> => {
  try {
    const res = await instance.get<ApiResponse<UserSettings>>(PATH)
    console.log('사용자 설정 GET 응답:', res.data)
    // API 응답 구조에 따라 data.settings 반환
    return res.data.settings // [수정] data.settings 반환
  } catch (error) {
    console.error('사용자 설정 GET 실패:', error)
    throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
  }
}

/**
 * 사용자 설정을 업데이트하는 서비스 함수 (PATCH)
 * @param settingsToUpdate 업데이트할 설정 객체
 * @returns Promise<UserSettings> 업데이트된 설정
 */
export const patchUserSettingsService = async (
  settingsToUpdate: Partial<UserSettings>, // 부분 업데이트를 위해 Partial 사용
): Promise<UserSettings> => {
  try {
    const res = await instance.patch<ApiResponse<UserSettings>>(PATH, settingsToUpdate)
    console.log('사용자 설정 PATCH 응답:', res.data)
    return res.data.settings // [수정] data.settings 반환
  } catch (error) {
    console.error('사용자 설정 PATCH 실패:', error)
    throw error
  }
}
