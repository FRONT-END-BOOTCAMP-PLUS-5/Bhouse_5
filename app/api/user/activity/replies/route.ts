// app/api/user/activity/replies/route.ts

import { NextResponse } from 'next/server'

import { GetUserRepliesUseCase } from 'backend/application/user/activity/replies/usecases/GetUserRepliesUseCase'
import { SupabaseCommunityReplyRepository } from 'backend/infrastructure/repositories/SupabaseCommunityReplyRepository'
import { GetUserRepliesQueryDto } from 'backend/application/user/activity/replies/dtos/GetUserRepliesQueryDto'

/**
 * 특정 사용자의 댓글 목록을 조회하는 API 엔드포인트입니다.
 * GET /api/user/activity/replies?uuid={userId}
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터 추출
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('uuid') // 'uuid' 파라미터로 사용자 ID 가져오기

  // FIXME: 실제 운영 환경에서는 'uuid' 대신 인증 토큰에서 사용자 ID를 추출해야 합니다.
  // 예시: const userId = await getUserIdFromAuthToken(request.headers.get('Authorization'));
  // if (!userId) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  // 필수 파라미터 누락 시 에러 응답
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'uuid 파라미터가 누락되었습니다.' },
      { status: 400 }, // Bad Request
    )
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
