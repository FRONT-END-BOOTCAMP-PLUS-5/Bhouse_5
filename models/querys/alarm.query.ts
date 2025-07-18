// src/models/querys/alarm.query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlarmsService, markAlarmsAsReadService, Alarm, AlarmType } from 'models/services/alarm.service' // AlarmType 임포트 추가

/**
 * 사용자 알림 목록을 가져오기 위한 React Query 훅
 * @param {AlarmType} [type] - 특정 알림 타입으로 필터링 (선택 사항)
 * @returns {object} useQuery 결과 객체 (data, isLoading, isError 등)
 */
export const useGetAlarms = (type?: AlarmType) => {
  // type 파라미터 추가
  return useQuery<Alarm[], Error>({
    queryKey: ['userAlarms', type], // type에 따라 캐싱 키를 다르게 설정
    queryFn: () => getAlarmsService(type), // type 파라미터 전달
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 알림을 읽음으로 표시하기 위한 React Query Mutation 훅
 * 성공 시 알림 목록 쿼리를 자동으로 무효화하여 최신 상태로 업데이트합니다.
 * @returns {object} useMutation 결과 객체 (mutate 함수 등)
 */
export const useMarkAlarmAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, { markAll?: boolean; alarmId?: string }>({
    mutationFn: markAlarmsAsReadService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAlarms'] })
    },
    onError: (error) => {
      console.error('알림 읽음 처리 실패:', error)
    },
  })
}
