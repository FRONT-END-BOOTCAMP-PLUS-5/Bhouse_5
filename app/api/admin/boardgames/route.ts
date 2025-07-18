// app/api/admin/boardgames/route.ts

import { NextResponse } from 'next/server'
import { supabaseClient } from '@be/utils/supabaseClient' // 미리 정의된 클라이언트 임포트

import { CreateBoardgameUseCase } from '@application/admin/boardgames/usecases/CreateBoardgameUseCase'
import { SupabaseBoardgameRepository } from '@infrastructure/repositories/SupabaseBoardgameRepository'
import { CreateBoardgameDto } from '@application/admin/boardgames/dtos/CreateBoardgameDto'
import { verifyToken } from '@be/utils/auth'

export async function POST(request: Request) {
  // 토큰 검증
  const decoded = await verifyToken(request)

  // 관리자 권한 확인 및 userId 추출
  // decoded가 없거나, roleId가 없거나, roleId가 '1'이 아니면 권한 없음
  if (!decoded || !decoded.roleId || decoded.roleId !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 인증된 사용자 ID를 decoded 토큰에서 가져옵니다.
  const userId = decoded.userId
  if (!userId) {
    // userId가 토큰에 없으면 에러 처리 (토큰 검증 로직에서 이미 처리될 수 있지만, 한 번 더 확인)
    return NextResponse.json({ error: 'User ID not found in token' }, { status: 400 })
  }

  try {
    const boardgameData = await request.json()

    // 필수 필드 유효성 검사 (프레젠테이션 계층의 책임)
    // user_id는 이제 body에서 받지 않고 decoded.userId를 사용하므로 제거합니다.
    const {
      kor_name, // name
      description,
      min_players,
      max_players,
      min_playtime,
      max_playtime,
      difficulty,
      img_url,
      genre_id,
    } = boardgameData

    // `kor_name`, `genre_id`는 NOT NULL 제약 조건이 있으므로 필수입니다.
    // user_id는 이제 body에서 받지 않으므로 유효성 검사에서 제거합니다.
    if (!kor_name || !genre_id) {
      return NextResponse.json(
        { success: false, error: '필수 필드(kor_name, genre_id)가 누락되었습니다.' },
        { status: 400 },
      )
    }

    // 1. 애플리케이션 계층으로 전달할 DTO 생성
    const createDto: CreateBoardgameDto = {
      // userId를 decoded 토큰에서 가져온 값으로 설정합니다.
      userId: userId, // decoded.userId를 사용
      korName: kor_name,
      description: description,
      minPlayers: min_players,
      maxPlayers: max_players,
      minPlaytime: min_playtime,
      maxPlaytime: max_playtime,
      difficulty: difficulty,
      imgUrl: img_url,
      genreId: genre_id,
    }

    // 2. 인프라 계층의 레포지토리 구현체 생성
    const boardgameRepository = new SupabaseBoardgameRepository() // supabaseClient는 내부에서 사용

    // 3. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const createBoardgameUseCase = new CreateBoardgameUseCase(boardgameRepository)

    // 4. 유즈케이스 실행
    const createdBoardgame = await createBoardgameUseCase.execute(createDto)

    // 성공 시 201 Created 상태 코드와 함께 응답
    return NextResponse.json(
      { success: true, message: '보드게임이 성공적으로 등록되었습니다.', boardgame: createdBoardgame },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('보드게임 등록 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
