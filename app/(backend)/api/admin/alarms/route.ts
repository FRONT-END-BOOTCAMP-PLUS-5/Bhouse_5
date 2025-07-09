// app/api/admin/alarms/route.ts
import { NextResponse } from 'next/server';
import { supabase } from 'backend/utils/supabaseClient';

export async function POST(request: Request) {
  // FIXME: 이 부분에 관리자 인증/인가 로직을 추가해야 합니다.
  // 예시: Bearer 토큰, 세션, 또는 특정 IP 주소 확인 등
  // 현재는 단순화를 위해 생략되었지만, 실제 운영 환경에서는 필수입니다.
  // if (!isAdmin(request)) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const { message, type: alarmType } = await request.json();

    // 필수 파라미터 유효성 검사
    if (!message || !alarmType) {
      return NextResponse.json(
        { success: false, error: 'message 또는 type 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 유효한 알림 타입인지 확인 (enum에 정의된 값인지)
    const validAlarmTypes = ['KEYWORD', 'REPLY', 'ADMIN'];
    if (!validAlarmTypes.includes(alarmType)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 알림 타입입니다.' },
        { status: 400 }
      );
    }

    // Supabase 함수 호출
    const { error } = await supabase.rpc('send_global_alarm', {
      p_message: message,
      p_alarm_type: alarmType,
    });

    if (error) {
      console.error('Supabase 함수 호출 에러:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 성공 시 201 Created 상태 코드와 함께 응답
    return NextResponse.json(
      { success: true, message: '전체 사용자에게 알림이 성공적으로 발송되었습니다.' },
      { status: 201 } // 201 Created 상태 코드 추가
    );

  } catch (error: any) {
    console.error('알림 발송 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
