// backend/infrastructure/services/SupabaseGlobalAlarmService.ts

import { supabaseClient } from "@be/utils/supabaseClient"; // Supabase 클라이언트 임포트
import GlobalAlarmService from "@domain/repositories/GlobalAlarmService";
import { AlarmType } from "@domain/entities/Alarm"; // AlarmType 필요 시 임포트

/**
 * GlobalAlarmService 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 함수 'send_global_alarm'을 호출합니다.
 */
export class SupabaseGlobalAlarmService implements GlobalAlarmService {
  async sendGlobalAlarm(message: string, alarmType: AlarmType): Promise<void> {
    const { error } = await supabaseClient.rpc('send_global_alarm', {
      p_message: message,
      p_alarm_type: alarmType,
    });

    if (error) {
      console.error('Supabase send_global_alarm 함수 호출 에러:', error.message);
      throw new Error(`Failed to send global alarm: ${error.message}`);
    }
  }
}