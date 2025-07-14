// app/api/user/keywords/route.ts

import { NextResponse } from 'next/server'
import { AddUserKeywordUseCase } from 'backend/application/user/keywords/usecases/AddUserKeywordUseCase'
import { GetUserKeywordsUseCase } from 'backend/application/user/keywords/usecases/GetUserKeywordsUseCase'
import { DeleteUserKeywordUseCase } from 'backend/application/user/keywords/usecases/DeleteUserKeywordUseCase'
import { SupabaseUserKeywordRepository } from 'backend/infrastructure/repositories/SupabaseUserKeywordRepository'
import { AddUserKeywordDto } from 'backend/application/user/keywords/dtos/AddUserKeywordDto'
import { GetUserKeywordsQueryDto } from 'backend/application/user/keywords/dtos/GetUserKeywordsQueryDto'
import { DeleteUserKeywordDto } from 'backend/application/user/keywords/dtos/DeleteUserKeywordDto'

export async function POST(request: Request) {
  // FIXME : 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 요청 본문에서 user_id를 직접 받는 것으로 가정합니다.

  try {
    const { user_id, keyword } = await request.json()

    // 필수 필드 유효성 검사
    if (!user_id || !keyword) {
      return NextResponse.json(
        { success: false, error: 'user_id 또는 keyword가 누락되었습니다.' },
        { status: 400 }, // Bad Request
      )
    }

    // 1. 인프라 계층의 레포지토리 구현체 생성
    const userKeywordRepository = new SupabaseUserKeywordRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const addUserKeywordUseCase = new AddUserKeywordUseCase(userKeywordRepository)

    // 3. 유즈케이스 실행
    const addDto: AddUserKeywordDto = { userId: user_id, keyword }
    const registeredKeyword = await addUserKeywordUseCase.execute(addDto)

    // 성공 시 201 Created 상태 코드와 함께 응답
    return NextResponse.json(
      { success: true, message: '키워드가 성공적으로 등록되었습니다.', keyword: registeredKeyword },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('키워드 등록 중 에러 발생:', error.message)
    if (error.message === '이미 존재하는 키워드입니다.') {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 }) // 409 Conflict
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  // ⚠️ 중요: 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 요청 본문에서 user_id를 직접 받는 것으로 가정합니다.

  try {
    const { user_id, keyword_id } = await request.json()

    // 필수 필드 유효성 검사
    if (!user_id || !keyword_id) {
      return NextResponse.json(
        { success: false, error: 'user_id 또는 keyword_id가 누락되었습니다.' },
        { status: 400 }, // Bad Request
      )
    }

    // 1. 인프라 계층의 레포지토리 구현체 생성
    const userKeywordRepository = new SupabaseUserKeywordRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const deleteUserKeywordUseCase = new DeleteUserKeywordUseCase(userKeywordRepository)

    // 3. 유즈케이스 실행
    const deleteDto: DeleteUserKeywordDto = { userId: user_id, keywordId: keyword_id }
    await deleteUserKeywordUseCase.execute(deleteDto)

    // 성공 시 204 No Content 상태 코드와 함께 응답 (본문 없음)
    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    console.error('키워드 삭제 중 에러 발생:', error.message)
    if (error.message === '지정된 키워드를 찾을 수 없거나 삭제 권한이 없습니다.') {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 }) // 404 Not Found
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // ⚠️ 중요: 실제 운영 환경에서는 사용자 인증/인가 로직이 필요합니다.
  // user_id는 인증된 사용자로부터 안전하게 얻어야 합니다.
  // 현재는 테스트를 위해 쿼리 파라미터에서 user_id를 직접 받는 것으로 가정합니다.

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('uuid') // 'uuid' 파라미터로 사용자 ID 가져오기

  // 필수 파라미터 누락 시 에러 응답
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'uuid 파라미터가 누락되었습니다.' },
      { status: 400 }, // Bad Request
    )
  }

  try {
    // 1. 인프라 계층의 레포지토리 구현체 생성
    const userKeywordRepository = new SupabaseUserKeywordRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const getUserKeywordsUseCase = new GetUserKeywordsUseCase(userKeywordRepository)

    // 3. 유즈케이스 실행
    const queryDto: GetUserKeywordsQueryDto = { userId }
    const keywords = await getUserKeywordsUseCase.execute(queryDto)

    // 성공 시 키워드 목록 반환
    return NextResponse.json({ success: true, keywords })
  } catch (error: any) {
    console.error('키워드 조회 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
