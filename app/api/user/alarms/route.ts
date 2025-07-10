// app/api/user/alarms/route.ts

import { NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server'; // 더 이상 createClient를 직접 사용하지 않음
import { supabaseClient } from 'backend/utils/supabaseClient'; // 이미 정의된 클라이언트 임포트

import { GetAlarmsByUserIdAndTypeUseCase } from 'backend/application/user/alarms/usecases/GetAlarmsByUserIdAndTypeUseCase';
import { SupabaseAlarmRepository } from 'backend/infrastructure/repositories/SupabaseAlarmRepository';
import { GetAlarmsQueryDto } from 'backend/application/user/alarms/dtos/GetAlarmsQueryDto';
import { AlarmType } from 'backend/domain/entities/Alarm';

/**
 * 특정 사용자의 알람 목록을 조회하는 API 엔드포인트입니다.
 * GET /api/user/alarms?uuid={userId}&type={alarmType}
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('uuid'); // 'uuid' 파라미터로 사용자 ID 가져오기
  const alarmTypeParam = searchParams.get('type'); // 'type' 파라미터로 알림 타입 가져오기

  // FIXME: 실제 운영 환경에서는 'uuid' 대신 인증 토큰에서 사용자 ID를 추출해야 합니다.
  // 예시: const userId = await getUserIdFromAuthToken(request.headers.get('Authorization'));
  // if (!userId) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }


  // 필수 파라미터 누락 시 에러 응답
  if (!userId || !alarmTypeParam) {
    return NextResponse.json(
      { success: false, error: 'uuid 또는 type 파라미터가 누락되었습니다.' },
      { status: 400 }
    );
  }

  // 알림 타입 유효성 검사 및 AlarmType 또는 'ALL'로 변환
  let alarmType: AlarmType | "ALL";
  const validAlarmTypes = Object.values(AlarmType); // Enum의 값들을 배열로 가져옴
  if (alarmTypeParam === 'ALL') {
    alarmType = 'ALL';
  } else if (validAlarmTypes.includes(alarmTypeParam as AlarmType)) {
    alarmType = alarmTypeParam as AlarmType;
  } else {
    return NextResponse.json(
      { success: false, error: '유효하지 않은 알림 타입입니다.' },
      { status: 400 }
    );
  }

  try {
    // 1. 인프라 계층의 레포지토리 구현체 생성 (supabaseClient를 직접 사용)
    const alarmRepository = new SupabaseAlarmRepository(); // 생성자에 인자를 넘길 필요 없음

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const getAlarmsUseCase = new GetAlarmsByUserIdAndTypeUseCase(alarmRepository);

    // 3. 유즈케이스 실행 (입력 DTO 사용)
    const queryDto: GetAlarmsQueryDto = { userId, alarmType };
    const result = await getAlarmsUseCase.execute(queryDto);

    // 4. 성공 응답 반환 (출력 DTO 사용)
    return NextResponse.json({ success: true, data: result.alarms, total: result.totalCount });

  } catch (error: any) {
    console.error('알람 조회 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}