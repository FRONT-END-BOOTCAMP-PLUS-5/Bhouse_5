import { NextRequest, NextResponse } from 'next/server'
import { PasswordFindUseCase } from '@be/application/auth/password-find/usecases/PasswordFindUseCase'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, phone } = body

    const usecase = new PasswordFindUseCase(new AuthRepositoryImpl())
    const result = await usecase.execute({ username, email, phone })

    if (result.status !== 200) {
      return NextResponse.json(
        {
          error: result.error,
          message: result.message,
          isVerified: result.isVerified,
        },
        { status: result.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      userId: result.userId,
      isVerified: result.isVerified,
    })
  } catch (error: any) {
    console.error('Password Find API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
