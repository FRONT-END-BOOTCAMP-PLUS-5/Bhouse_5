// app/api/user/activity/posts/route.ts

import { NextResponse } from 'next/server'
// import { supabaseClient } from 'backend/utils/supabaseClient'; // 이 파일에서는 직접 사용하지 않음

import { GetUserPostsUseCase } from '@application/user/activity/posts/usecases/GetUserPostsUseCase'
import { SupabaseCommunityPostRepository } from 'backend/infrastructure/repositories/SupabaseCommunityPostRepository'
import { GetUserPostsQueryDto } from '@application/user/activity/posts/dtos/GetUserPostsQueryDto'

/**
 * 특정 사용자의 게시글 목록을 조회하는 API 엔드포인트입니다.
 * GET /api/user/activity/posts?uuid={userId}
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
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
    const communityPostRepository = new SupabaseCommunityPostRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const getUserPostsUseCase = new GetUserPostsUseCase(communityPostRepository)

    // 3. 유즈케이스 실행
    const queryDto: GetUserPostsQueryDto = { userId }
    const result = await getUserPostsUseCase.execute(queryDto)

    // 4. 성공 응답 반환
    return NextResponse.json(
      { success: true, data: result.data, total: result.total },
      { status: 200 }, // OK
    )
  } catch (error: unknown) {
    console.error('사용자 게시글 조회 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) // Internal Server Error
  }
}
