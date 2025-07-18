// src/models/services/alarm.service.ts
import instance from '@utils/instance'

interface ApiResponse<T> {
  success: boolean
  data: T
}

// AlarmType에 'ALL' 추가
export type AlarmType = 'KEYWORD' | 'REPLY' | 'ADMIN' | 'ALL'

interface BaseAlarm {
  id: string
  is_read: boolean
  created_at: string
  type: AlarmType // 이제 type은 'ALL'도 포함할 수 있습니다.
}

export interface KeywordAlarm extends BaseAlarm {
  type: 'KEYWORD'
  message: string
}

export interface ReplyAlarm extends BaseAlarm {
  type: 'REPLY'
  title: string
}

export interface AdminAlarm extends BaseAlarm {
  type: 'ADMIN'
  message: string
}

// Alarm 타입은 특정 타입일 경우에만 해당 속성을 가집니다.
// type이 'ALL'일 경우 message나 title은 없을 수 있습니다.
// 하지만 현재 AlarmDropdown에서는 message나 title을 그대로 사용하므로,
// 백엔드에서 'ALL' 요청 시에도 각 알림 객체에 적절한 message 또는 title 필드를 제공한다고 가정합니다.
export type Alarm = KeywordAlarm | ReplyAlarm | AdminAlarm

const ALARMS_PATH = '/api/user/alarms'

/**
 * 사용자 알림 목록을 가져옵니다.
 * @param {AlarmType} [type] - 특정 알림 타입으로 필터링 (선택 사항)
 * @returns {Promise<Alarm[]>} 알림 배열을 반환합니다.
 */
export const getAlarmsService = async (type?: AlarmType): Promise<Alarm[]> => {
  let url = ALARMS_PATH
  if (type) {
    url = `${ALARMS_PATH}?type=${type}` // type 파라미터가 있을 경우 URL에 추가
  }
  const res = await instance.get<ApiResponse<Alarm[]>>(url)
  console.log('Alarms API 응답:', res.data)
  return res.data?.data ?? []
}

interface MarkAlarmAsReadPayload {
  markAll?: boolean
  alarmId?: string
}

export const markAlarmsAsReadService = async (payload: MarkAlarmAsReadPayload): Promise<any> => {
  const res = await instance.patch<ApiResponse<any>>(ALARMS_PATH, payload)
  console.log('Mark Alarms as Read API 응답:', res.data)
  return res.data
}
