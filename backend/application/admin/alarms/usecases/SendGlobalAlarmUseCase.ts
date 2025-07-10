// backend/application/admin/alarms/usecases/SendGlobalAlarmUseCase.ts

import GlobalAlarmService from "@domain/repositories/GlobalAlarmService"; // 새로 정의한 인터페이스 임포트
import { SendGlobalAlarmDto } from "../dtos/SendGlobalAlarmDto"; // 새로운 DTO 임포트

/**
 * 어드민 권한으로 전체 사용자에게 알람을 발송하는 유즈케이스입니다.
 * Supabase 함수 호출과 같은 외부 시스템 의존성을 분리합니다.
 */
export class SendGlobalAlarmUseCase {
  private globalAlarmService: GlobalAlarmService;

  constructor(globalAlarmService: GlobalAlarmService) {
    this.globalAlarmService = globalAlarmService;
  }

  /**
   * 전역 알람을 발송합니다.
   * param dto 알람 메시지와 타입을 포함하는 DTO
   */
  async execute(dto: SendGlobalAlarmDto): Promise<void> {
    // 비즈니스 로직 (여기서는 유효성 검증 외에 특별한 비즈니스 로직은 없음)
    // Supabase 함수 호출은 GlobalAlarmService 구현체에 위임

    await this.globalAlarmService.sendGlobalAlarm(dto.message, dto.alarmType);
  }
}