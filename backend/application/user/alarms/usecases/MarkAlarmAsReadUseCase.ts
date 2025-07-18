// backend/application/user/alarms/usecases/MarkAlarmAsReadUseCase.ts

import AlarmRepository from '@domain/repositories/AlarmRepository'
import { MarkAlarmsAsReadDto } from '../dtos/MarkAlarmsAsReadDto'

/**
 * 특정 알람 또는 모든 알람을 읽음 상태로 표시하는 유즈케이스입니다.
 */
export class MarkAlarmAsReadUseCase {
  private alarmRepository: AlarmRepository

  constructor(alarmRepository: AlarmRepository) {
    this.alarmRepository = alarmRepository
  }

  /**
   * 주어진 DTO에 따라 알람을 읽음 상태로 업데이트합니다.
   * - `alarmId`가 제공되면 해당 알람만 읽음 처리합니다.
   * - `markAll`이 true이고 `userId`가 제공되면 해당 사용자의 모든 알람을 읽음 처리합니다.
   * @param dto 읽음 처리할 알람 ID 또는 전체 읽음 처리 여부를 포함하는 DTO
   * @param userId (선택적) `markAll`이 true일 경우 필요한 사용자 ID
   */
  async execute(dto: MarkAlarmsAsReadDto, userId?: string): Promise<void> {
    if (dto.alarmId !== undefined && dto.alarmId !== null) {
      // 특정 알람 ID가 주어진 경우
      await this.alarmRepository.markAsRead(dto.alarmId)
    } else if (dto.markAll === true && userId) {
      // markAll이 true이고 userId가 주어진 경우
      await this.alarmRepository.markAllAsRead(userId)
    } else {
      // 유효하지 않은 요청 (alarmId 또는 markAll/userId 조합이 없음)
      throw new Error('Invalid request: Either alarmId or markAll (with userId) must be provided.')
    }
  }
}
