// backend/application/admin/alarms/usecases/CreateAlarmsUseCase.ts

import { Alarm, AlarmType } from '@domain/entities/Alarm' // 도메인 계층의 Alarm 엔티티 임포트
import AlarmRepository from '@domain/repositories/AlarmRepository' // 도메인 계층의 AlarmRepository 인터페이스 임포트
import { CreateAlarmDto } from '../dtos/CreateAlarmDto' // 애플리케이션 계층의 DTO 임포트
import { CreatedAlarmDto } from '../dtos/CreatedAlarmDto' // 생성 후 반환할 DTO (아래에 정의 예정)

/**
 * 어드민 권한으로 전체 사용자에게 알람을 생성하는 유즈케이스입니다.
 */
export class CreateAlarmsUseCase {
  private alarmRepository: AlarmRepository

  constructor(alarmRepository: AlarmRepository) {
    this.alarmRepository = alarmRepository
  }

  /**
   * 새로운 알람을 생성하여 저장합니다.
   * param createAlarmsDto 알람 생성에 필요한 데이터 (userId, message, alarmType)
   * returns 생성된 알람 정보 (alarmId, userId, message, isRead, createdAt, alarmType)
   */
  async execute(createAlarmsDto: CreateAlarmDto): Promise<CreatedAlarmDto> {
    // 1. DTO로부터 Alarm 엔티티 객체 생성
    // isRead와 createdAt은 엔티티 생성 시 기본값이 설정되므로 DTO에서 받아오지 않습니다.
    const newAlarm = new Alarm(
      0, // alarmId는 DB에서 자동 생성되므로 초기값은 0 또는 undefined로 설정 (실제 저장 시 변경)
      createAlarmsDto.userId,
      createAlarmsDto.message,
      false, // isRead 기본값
      new Date(), // createdAt 기본값
      createAlarmsDto.alarmType,
    )

    // 2. AlarmRepository를 통해 알람 저장
    const savedAlarm = await this.alarmRepository.save(newAlarm)

    // 3. 저장된 Alarm 엔티티를 CreatedAlarmDto로 변환하여 반환
    return {
      alarmId: savedAlarm.alarmId,
      userId: savedAlarm.userId,
      message: savedAlarm.message,
      isRead: savedAlarm.isRead,
      createdAt: savedAlarm.createdAt.toISOString(), // ISO 문자열로 변환하여 반환
      alarmType: savedAlarm.alarmType,
    }
  }
}
