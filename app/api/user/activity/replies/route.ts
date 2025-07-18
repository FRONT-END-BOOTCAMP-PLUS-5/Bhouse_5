// app/api/user/activity/replies/route.ts

import { NextRequest, NextResponse } from 'next/server'

import { GetUserRepliesUseCase } from 'backend/application/user/activity/replies/usecases/GetUserRepliesUseCase'
import { SupabaseCommunityReplyRepository } from 'backend/infrastructure/repositories/SupabaseCommunityReplyRepository'
import { GetUserRepliesQueryDto } from 'backend/application/user/activity/replies/dtos/GetUserRepliesQueryDto'
import { verifyToken } from '@be/utils/auth'

/**
 * 특정 사용자의 댓글 목록을 조회하는 API 엔드포인트입니다.
 * GET /api/user/activity/replies
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
    const communityReplyRepository = new SupabaseCommunityReplyRepository()

    // 2. 애플리케이션 계층의 유즈케이스 생성 및 레포지토리 주입
    const getUserRepliesUseCase = new GetUserRepliesUseCase(communityReplyRepository)

    // 3. 유즈케이스 실행
    const queryDto: GetUserRepliesQueryDto = { userId }
    const result = await getUserRepliesUseCase.execute(queryDto)

    // 4. 성공 응답 반환
    return NextResponse.json(
      { success: true, data: result.data, total: result.total },
      { status: 200 }, // OK
    )
  } catch (error: any) {
    console.error('사용자 댓글 조회 중 에러 발생:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) // Internal Server Error
  }
}
