// app/user/alarms/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@bUtils/supabaseClient';

// type은 'KEYWORD', 'ADMIN', 'REPLY', 'ALL' 중 하나로 설정, 수파베이스에 등록된 대로
// http://localhost:3000/api/user/alarms?uuid=0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196&type=KEYWORD
// http://localhost:3000/api/user/alarms?uuid=0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196&type=ADMIN
// http://localhost:3000/api/user/alarms?uuid=0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196&type=REPLY
// http://localhost:3000/api/user/alarms?uuid=0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196&type=ALL


//FIXME: 요청으로 token 대신 임시로 uuid입력.
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('uuid'); // 'uuid' 파라미터로 사용자 ID 가져오기
  const alarmType = searchParams.get('type'); // 'type' 파라미터로 알림 타입 가져오기

  // 필수 파라미터 누락 시 에러 응답
  if (!userId || !alarmType) {
    return NextResponse.json(
      { success: false, error: 'uuid 또는 type 파라미터가 누락되었습니다.' },
      { status: 400 }
    );
  }

  // Supabase 쿼리 빌드
  // 'count: exact' 옵션을 사용하여 총 개수를 정확히 가져옵니다.
  let query = supabase
    .from('alarms')
    .select('alarm_id, alarm_type, message, is_read, created_at', { count: 'exact' });

  // 사용자 ID로 필터링
  query = query.eq('user_id', userId);

  // 'all' 타입이 아닌 경우에만 알림 타입으로 필터링
  if (alarmType !== 'all') {
    query = query.eq('alarm_type', alarmType);
  }

  // 쿼리 실행
  const { data, error, count } = await query;

  // 에러 발생 시 에러 응답
  if (error) {
    console.error('Supabase 쿼리 에러:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // 응답 형식에 맞게 데이터 가공
  const formattedData = data.map((alarm) => {
    const baseAlarm = {
      id: alarm.alarm_id, // 알림 ID
      type: alarm.alarm_type, // 알림 타입
      is_read: alarm.is_read, // 읽음 여부
      created_at: alarm.created_at, // 생성 시간
    };

    // 'reply' 타입인 경우 'message' 필드를 'title'로 변경
    if (alarm.alarm_type === 'reply') {
      return {
        ...baseAlarm,
        title: alarm.message, // message 내용을 title로 사용
      };
    } else {
      // 그 외 타입인 경우 'message' 필드 그대로 사용
      return {
        ...baseAlarm,
        message: alarm.message,
      };
    }
  });

  // 성공 응답 반환
  return NextResponse.json({ success: true, data: formattedData, total: count });
}