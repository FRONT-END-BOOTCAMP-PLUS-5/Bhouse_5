// models/queries/setting.query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserSettingsService, patchUserSettingsService, UserSettings } from 'models/services/setting.service'

/**
 * 사용자 설정 목록을 가져오는 useQuery 훅
 * @returns useQueryResult<UserSettings>
 */
export const useGetUserSettings = () => {
  return useQuery<UserSettings, Error>({
    queryKey: ['userSettings'], // 쿼리 키 정의
    queryFn: getUserSettingsService, // 서비스 함수 연결
    staleTime: 5 * 60 * 1000, // 5분 동안 fresh 상태 유지
    cacheTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화 (선택 사항)
  })
}

/**
 * 사용자 설정을 업데이트하는 useMutation 훅
 * @returns useMutationResult<UserSettings, Error, Partial<UserSettings>>
 */
export const usePatchUserSettings = () => {
  const queryClient = useQueryClient() // QueryClient 인스턴스 가져오기

  return useMutation<UserSettings, Error, Partial<UserSettings>>({
    mutationFn: patchUserSettingsService, // 서비스 함수 연결
    onSuccess: (data) => {
      // 뮤테이션 성공 시 캐시된 'userSettings' 쿼리 데이터를 업데이트
      queryClient.setQueryData<UserSettings>(['userSettings'], (oldData) => {
        return oldData ? { ...oldData, ...data } : data
      })
      console.log('사용자 설정이 성공적으로 업데이트되었습니다:', data)
    },
    onError: (error) => {
      console.error('사용자 설정 업데이트 실패:', error)
      // 에러 발생 시 사용자에게 알림 등의 처리
    },
  })
}
