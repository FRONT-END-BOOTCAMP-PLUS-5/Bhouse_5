// app/api/user/settings/route.ts
import { NextResponse } from 'next/server';
import { supabase } from 'backend/utils/supabaseClient'; // 사용자 지정 Supabase 클라이언트 임포트

// 유저 알림 설정을 조회하는 GET 요청 핸들러
export async function GET(request: Request) {
  // FIXME: 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 쿼리 파라미터에서 user_id를 받는 것으로 가정합니다.
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  // 필수 필드 유효성 검사
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'user_id가 누락되었습니다.' },
      { status: 400 } // Bad Request
    );
  }

  try {
    // Supabase에서 user_setting 데이터 조회
    const { data, error } = await supabase
      .from('user_setting')
      .select('keyword_alarm, reply_alarm') // 필요한 컬럼만 선택
      .eq('user_id', userId)
      .single(); // 단일 레코드만 기대하므로 .single() 사용

    if (error) {
      console.error('알림 설정 조회 중 Supabase 에러:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 }); // Internal Server Error
    }

    if (!data) {
      // 해당 user_id에 대한 설정이 없는 경우 (예: 유저가 아직 가입하지 않았거나 설정이 생성되지 않음)
      return NextResponse.json(
        { success: false, error: '해당 유저의 알림 설정을 찾을 수 없습니다.' },
        { status: 404 } // Not Found
      );
    }

    // 데이터 형식 변환 (boolean -> 'Y'/'N')
    const formattedData = {
      reply: data.reply_alarm ? 'Y' : 'N',
      keyword: data.keyword_alarm ? 'Y' : 'N',
    };

    return NextResponse.json(
      { success: true, settings: formattedData },
      { status: 200 } // OK
    );

  } catch (error: any) {
    console.error('알림 설정 조회 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); // Internal Server Error
  }
}

// 유저 알림 설정을 수정하는 PATCH 요청 핸들러
export async function PATCH(request: Request) {
  // FIXME: 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 요청 본문에서 user_id를 직접 받는 것으로 가정합니다.

  try {
    const { user_id, reply, keyword } = await request.json();

    // 필수 필드 유효성 검사
    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id가 누락되었습니다.' },
        { status: 400 } // Bad Request
      );
    }

    // 업데이트할 데이터 객체 생성
    const updateData: { keyword_alarm?: boolean; reply_alarm?: boolean } = {};

    // 'Y'/'N' 값을 boolean으로 변환하여 updateData에 추가
    if (reply !== undefined) {
      if (reply === 'Y' || reply === 'N') {
        updateData.reply_alarm = (reply === 'Y');
      } else {
        return NextResponse.json(
          { success: false, error: 'reply 값은 "Y" 또는 "N"이어야 합니다.' },
          { status: 400 }
        );
      }
    }

    if (keyword !== undefined) {
      if (keyword === 'Y' || keyword === 'N') {
        updateData.keyword_alarm = (keyword === 'Y');
      } else {
        return NextResponse.json(
          { success: false, error: 'keyword 값은 "Y" 또는 "N"이어야 합니다.' },
          { status: 400 }
        );
      }
    }

    // 업데이트할 데이터가 없는 경우 (예: 빈 요청 본문)
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 알림 설정이 없습니다.' },
        { status: 400 } // Bad Request
      );
    }

    // Supabase에서 user_setting 데이터 업데이트
    const { data, error } = await supabase
      .from('user_setting')
      .update(updateData)
      .eq('user_id', user_id)
      .select('keyword_alarm, reply_alarm'); // 업데이트된 레코드를 반환받기 위해 select() 사용

    if (error) {
      console.error('알림 설정 업데이트 중 Supabase 에러:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 }); // Internal Server Error
    }

    // 업데이트된 레코드가 없는 경우 (user_id에 해당하는 설정이 없는 경우)
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: '해당 유저의 알림 설정을 찾을 수 없거나 업데이트할 권한이 없습니다.' },
        { status: 404 } // Not Found
      );
    }

    // 성공 시 업데이트된 데이터 반환 (boolean -> 'Y'/'N' 변환)
    const updatedFormattedData = {
      reply: data[0].reply_alarm ? 'Y' : 'N',
      keyword: data[0].keyword_alarm ? 'Y' : 'N',
    };

    return NextResponse.json(
      { success: true, message: '알림 설정이 성공적으로 업데이트되었습니다.', settings: updatedFormattedData },
      { status: 200 } // OK
    );

  } catch (error: any) {
    console.error('알림 설정 업데이트 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); // Internal Server Error
  }
}