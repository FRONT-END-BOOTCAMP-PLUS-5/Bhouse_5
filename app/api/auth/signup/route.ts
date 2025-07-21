import { NextRequest, NextResponse } from 'next/server'
import { CreateAuthUsecase } from '@be/application/auth/signup/usecases/CreateAuthUsescase'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'
import { CreateAuthDto } from '@be/application/auth/signup/dtos/CreateAuthDto'

export async function POST(req: NextRequest) {
  try {
    const body: CreateAuthDto = await req.json()

    // UseCase 인스턴스 생성
    const authRepository = new AuthRepositoryImpl()
    const createAuthUsecase = new CreateAuthUsecase(authRepository)

    // UseCase 실행
    const result = await createAuthUsecase.execute(body)

    // UseCase에서 에러를 반환한 경우
    if (result.status !== 201) {
      return NextResponse.json(result, { status: result.status })
    }

    return NextResponse.json(result, { status: result.status })
  } catch (error) {
    console.error('Signup API Error:', error)
    return NextResponse.json(
      {
        message: '서버 오류',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
