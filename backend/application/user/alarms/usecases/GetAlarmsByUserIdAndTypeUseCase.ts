// backend/application/user/alarms/usecases/GetAlarmsByUserIdAndTypeUseCase.ts

import AlarmRepository from '@domain/repositories/AlarmRepository'
import { GetAlarmsQueryDto } from '../dtos/GetAlarmsQueryDto'
import { AlarmResponseDto, GetAlarmsResponseDto } from '../dtos/AlarmResponseDto'
import { AlarmType } from '@domain/entities/Alarm'

/**
 * 특정 사용자의 알람을 타입별로 조회하는 유즈케이스입니다.
 */
export class GetAlarmsByUserIdAndTypeUseCase {
  private alarmRepository: AlarmRepository

  constructor(alarmRepository: AlarmRepository) {
    this.alarmRepository = alarmRepository
  }

  /**
   * 사용자 ID와 알람 타입에 따라 알람 목록을 조회하고,
   * 응답 DTO 형식에 맞춰 데이터를 가공하여 반환합니다.
   * @param queryDto 조회 조건을 담은 DTO (userId, alarmType)
   * @returns 알람 목록과 총 개수를 포함하는 응답 DTO
   */
  async execute(queryDto: GetAlarmsQueryDto): Promise<GetAlarmsResponseDto> {
    // 1. AlarmRepository를 통해 데이터 조회
    const { alarms, totalCount } = await this.alarmRepository.findByUserIdAndType(queryDto.userId, queryDto.alarmType)

    // 2. 조회된 Alarm 엔티티를 AlarmResponseDto로 변환 및 가공
    const formattedAlarms: AlarmResponseDto[] = alarms.map((alarm) => {
      const baseAlarm: AlarmResponseDto = {
        id: alarm.alarmId,
        type: alarm.alarmType,
        is_read: alarm.isRead,
        created_at: alarm.createdAt.toISOString(), // Date 객체를 ISO 문자열로 변환
        post_id: alarm.postId, // postId 속성 추가
      }

      // 'reply' 타입인 경우 'message' 필드를 'title'로 변경
      if (alarm.alarmType === AlarmType.REPLY) {
        return {
          ...baseAlarm,
          title: alarm.message, // message 내용을 title로 사용
        }
      } else {
        // 그 외 타입인 경우 'message' 필드 그대로 사용
        return {
          ...baseAlarm,
          message: alarm.message,
        }
      }
    })

    // 3. 최종 응답 DTO 반환
    return {
      alarms: formattedAlarms,
      totalCount: totalCount,
    }
  }
}
