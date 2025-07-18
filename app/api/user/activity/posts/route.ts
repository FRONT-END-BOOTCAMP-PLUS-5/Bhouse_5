// app/api/user/activity/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
// import { supabaseClient } from 'backend/utils/supabaseClient'; // 이 파일에서는 직접 사용하지 않음

import { GetUserPostsUseCase } from '@application/user/activity/posts/usecases/GetUserPostsUseCase'
import { SupabaseCommunityPostRepository } from 'backend/infrastructure/repositories/SupabaseCommunityPostRepository'
import { GetUserPostsQueryDto } from '@application/user/activity/posts/dtos/GetUserPostsQueryDto'
import { verifyToken } from '@be/utils/auth'

/**
 * 특정 사용자의 게시글 목록을 조회하는 API 엔드포인트입니다.
 * GET /api/user/activity/posts
 */
export async function GET(request: NextRequest) {
  // 토큰 검증
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
  } catch (error: any) {
    console.error('사용자 게시글 조회 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) // Internal Server Error
  }
}
