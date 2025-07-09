// app/api/admin/boardgames/register/route.ts
import { NextResponse } from 'next/server';
import { supabase } from 'backend/utils/supabaseClient'; // 사용자 지정 Supabase 클라이언트 임포트

export async function POST(request: Request) {
  //FIXME : 이 부분에 관리자 인증/인가 로직을 추가해야 합니다.
  // 예시: Bearer 토큰 검증, 세션 확인, 또는 특정 사용자 역할 확인 등
  // if (!isAdmin(request)) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const boardgameData = await request.json();

    // 필수 필드 유효성 검사
    const {
      user_id, // created_by, updated_by
      kor_name, // name
      description,
      min_players,
      max_players,
      min_playtime,
      max_playtime,
      difficulty,
      img_url,
      genre_id,
      // eng_name은 스키마에 없으므로 여기서는 사용하지 않습니다.
    } = boardgameData;

    // `name`, `user_id`, `genre_id`는 NOT NULL 제약 조건이 있으므로 필수입니다.
    if (!kor_name || !user_id || !genre_id) {
      return NextResponse.json(
        { success: false, error: '필수 필드(kor_name, user_id, genre_id)가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스 삽입을 위한 객체 준비
    const dataToInsert = {
      name: kor_name, // kor_name을 name 컬럼에 매핑
      description: description || null,
      min_players: min_players || null,
      max_players: max_players || null,
      created_by: user_id,
      // created_at은 DB 기본값 사용
      updated_at: new Date().toISOString(), // 현재 시간을 ISO 문자열로 설정
      updated_by: user_id,
      min_playtime: min_playtime || null,
      max_playtime: max_playtime || null,
      difficulty: difficulty || null,
      genre_id: genre_id,
      img_url: img_url || null,
    };

    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('boardgames')
      .insert([dataToInsert])
      .select(); // 삽입된 레코드를 반환받기 위해 .select() 사용

    if (error) {
      console.error('보드게임 등록 중 Supabase 에러:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 성공 시 201 Created 상태 코드와 함께 응답
    // 삽입된 데이터의 첫 번째 항목을 반환 (단일 삽입이므로)
    return NextResponse.json(
      { success: true, message: '보드게임이 성공적으로 등록되었습니다.', boardgame: data[0] },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('보드게임 등록 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}