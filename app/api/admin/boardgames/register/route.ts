// app/api/admin/boardgames/register/route.ts

import { NextResponse } from 'next/server';
// import { supabase } from 'backend/utils/supabaseClient'; // 기존 파일과 동일하게 supabaseClient 임포트
import { supabaseClient } from 'backend/utils/supabaseClient'; // 미리 정의된 클라이언트 임포트

import { RegisterBoardgameUseCase } from 'backend/application/admin/boardgames/usecases/RegisterBoardgameUseCase';
import { SupabaseBoardgameRepository } from 'backend/infrastructure/repositories/SupabaseBoardgameRepository';
import { RegisterBoardgameDto } from 'backend/application/admin/boardgames/dtos/RegisterBoardgameDto';

/**
 * 새로운 보드게임을 등록하는 API 엔드포인트입니다.
 * POST /api/admin/boardgames/register
 */
export async function POST(request: Request) {
  // FIXME: 이 부분에 관리자 인증/인가 로직을 추가해야 합니다.
  // 예시: Bearer 토큰 검증, 세션 확인, 또는 특정 사용자 역할 확인 등
  // if (!isAdmin(request)) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const boardgameData = await request.json();

    // 필수 필드 유효성 검사 (프레젠테이션 계층의 책임)
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
    } = boardgameData;

    // `name`, `user_id`, `genre_id`는 NOT NULL 제약 조건이 있으므로 필수입니다.
    // FIXME: user_id는 실제 인증 시스템에서 가져와야 합니다. 현재는 요청 바디에서 받음.
    if (!kor_name || !user_id || !genre_id) {
      return NextResponse.json(
        { success: false, error: '필수 필드(kor_name, user_id, genre_id)가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 1. 애플리케이션 계층으로 전달할 DTO 생성
    const registerDto: RegisterBoardgameDto = {
      userId: user_id,
      korName: kor_name,
      description: description,
      minPlayers: min_players,
      maxPlayers: max_players,
      minPlaytime: min_playtime,
      maxPlaytime: max_playtime,
      difficulty: difficulty,
      imgUrl: img_url,
      genreId: genre_id,
    };

    // 2. 인프라 계층의 레포지토리 구현체 생성
    const boardgameRepository = new SupabaseBoardgameRepository(); // supabaseClient는 내부에서 사용

    // 3. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const registerBoardgameUseCase = new RegisterBoardgameUseCase(boardgameRepository);

    // 4. 유즈케이스 실행
    const registeredBoardgame = await registerBoardgameUseCase.execute(registerDto);

    // 성공 시 201 Created 상태 코드와 함께 응답
    return NextResponse.json(
      { success: true, message: '보드게임이 성공적으로 등록되었습니다.', boardgame: registeredBoardgame },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('보드게임 등록 중 에러 발생:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}