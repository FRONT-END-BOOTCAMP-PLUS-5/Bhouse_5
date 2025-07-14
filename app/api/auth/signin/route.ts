import { NextRequest, NextResponse } from 'next/server'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'
import { SigninUsecase } from '@be/application/auth/signin/usecases/SigninUsecase'

export async function POST(request: NextRequest) {
  try {
    // Basic Auth 헤더를 UseCase로 전달
    const authHeader = request.headers.get('authorization')
    const usecase = new SigninUsecase(new AuthRepositoryImpl())
    const result = await usecase.execute(authHeader)

    return NextResponse.json(result, { status: result.status })
  } catch (error) {
    console.error('로그인 처리 중 오류 발생:', error)
    return NextResponse.json(
      {
        message: '서버 오류가 발생했습니다.',
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 },
    )
  }
}
