// app/api/user/keywords/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { AddUserKeywordUseCase } from 'backend/application/user/keywords/usecases/AddUserKeywordUseCase'
import { GetUserKeywordsUseCase } from 'backend/application/user/keywords/usecases/GetUserKeywordsUseCase'
import { DeleteUserKeywordUseCase } from 'backend/application/user/keywords/usecases/DeleteUserKeywordUseCase'
import { SupabaseUserKeywordRepository } from 'backend/infrastructure/repositories/SupabaseUserKeywordRepository'
import { AddUserKeywordDto } from 'backend/application/user/keywords/dtos/AddUserKeywordDto'
import { GetUserKeywordsQueryDto } from 'backend/application/user/keywords/dtos/GetUserKeywordsQueryDto'
import { DeleteUserKeywordDto } from 'backend/application/user/keywords/dtos/DeleteUserKeywordDto'
import { verifyToken } from '@be/utils/auth'

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = decoded.userId
    const { keyword } = await request.json()

    // 필수 필드 유효성 검사
    if (!userId || !keyword) {
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
    const addDto: AddUserKeywordDto = { userId: userId, keyword }
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

export async function DELETE(request: NextRequest) {
  try {
    // 인증된 사용자 ID를 decoded 토큰에서 가져옵니다.
    const decoded = await verifyToken(request)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = decoded.userId

    const { keyword_id } = await request.json()

    // 필수 필드 유효성 검사
    if (!userId || !keyword_id) {
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
    const deleteDto: DeleteUserKeywordDto = { userId: userId, keywordId: keyword_id }
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

export async function GET(request: NextRequest) {
  const decoded = await verifyToken(request)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // 인증된 사용자 ID를 decoded 토큰에서 가져옵니다.
  const userId = decoded.userId

  if (!userId) {
    // userId가 토큰에 없으면 에러 처리 (토큰 검증 로직에서 이미 처리될 수 있지만, 한 번 더 확인)
    return NextResponse.json({ error: 'User ID not found in token' }, { status: 400 })
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
