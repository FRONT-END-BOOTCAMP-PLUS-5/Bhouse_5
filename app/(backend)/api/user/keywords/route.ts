// app/api/user/keywords/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@bUtils/supabaseClient'; // 사용자 지정 Supabase 클라이언트 임포트


export async function POST(request: Request) {
  // FIXME : 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 요청 본문에서 user_id를 직접 받는 것으로 가정합니다.

  try {
    const { user_id, keyword } = await request.json();

    // 필수 필드 유효성 검사
    if (!user_id || !keyword) {
      return NextResponse.json(
        { success: false, error: 'user_id 또는 keyword가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // Supabase에 키워드 삽입
    const { data, error } = await supabase
      .from('user_community_alarm_keywords')
      .insert([{ user_id, keyword }])
      .select(); // 삽입된 레코드를 반환받기 위해 .select() 사용

    if (error) {
      console.error('키워드 등록 중 Supabase 에러:', error.message);
      // 중복 키 에러 등 특정 에러에 대한 더 상세한 처리가 가능합니다.
      if (error.code === '23505') { // PostgreSQL unique_violation 에러 코드
        return NextResponse.json({ success: false, error: '이미 존재하는 키워드입니다.' }, { status: 409 }); // 409 Conflict
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 성공 시 201 Created 상태 코드와 함께 응답
    return NextResponse.json(
      { success: true, message: '키워드가 성공적으로 등록되었습니다.', keyword: data[0] },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('키워드 등록 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // ⚠️ 중요: 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 요청 본문에서 user_id를 직접 받는 것으로 가정합니다.

  try {
    const { user_id, keyword_id } = await request.json();

    // 필수 필드 유효성 검사
    if (!user_id || !keyword_id) {
      return NextResponse.json(
        { success: false, error: 'user_id 또는 keyword_id가 누락되었습니다.' },
        { status: 400 } // Bad Request
      );
    }

    // Supabase에서 키워드 삭제
    // primary key (keyword_id, user_id)를 활용하여 정확한 레코드 삭제
    const { data, error } = await supabase
      .from('user_community_alarm_keywords')
      .delete()
      .eq('keyword_id', keyword_id)
      .eq('user_id', user_id)
      .select(); // 삭제된 레코드를 확인하기 위해 select()를 사용합니다.

    if (error) {
      console.error('키워드 삭제 중 Supabase 에러:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 }); // Internal Server Error
    }

    // data가 null이거나 빈 배열이면 삭제된 레코드가 없음을 의미합니다.
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: '지정된 키워드를 찾을 수 없거나 삭제 권한이 없습니다.' },
        { status: 404 } // Not Found
      );
    }

    // 성공 시 204 No Content 상태 코드와 함께 응답 (본문 없음)
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error('키워드 삭제 중 에러 발생:', error.message);
    // JSON 파싱 에러 등을 포함한 일반적인 클라이언트 요청 에러는 400 Bad Request로 처리할 수도 있습니다.
    // 여기서는 포괄적으로 500으로 처리합니다.
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); // Internal Server Error
  }
}

export async function GET(request: Request) {
  // ⚠️ 중요: 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 쿼리 파라미터에서 user_id를 직접 받는 것으로 가정합니다.

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('uuid'); // 'uuid' 파라미터로 사용자 ID 가져오기

  // 필수 파라미터 누락 시 에러 응답
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'uuid 파라미터가 누락되었습니다.' },
      { status: 400 }
    );
  }

  try {
    // Supabase에서 해당 user_id의 키워드 목록 조회
    const { data, error } = await supabase
      .from('user_community_alarm_keywords')
      .select('keyword_id, keyword, created_at') // 필요한 컬럼만 선택
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // 최신순 정렬

    if (error) {
      console.error('키워드 조회 중 Supabase 에러:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 응답 형식에 맞게 데이터 가공
    const formattedKeywords = data.map(item => ({
      keyword_id: item.keyword_id,
      keyword: item.keyword,
      created_at: item.created_at,
    }));

    // 성공 시 키워드 목록 반환
    return NextResponse.json({ success: true, keywords: formattedKeywords });

  } catch (error: any) {
    console.error('키워드 조회 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}