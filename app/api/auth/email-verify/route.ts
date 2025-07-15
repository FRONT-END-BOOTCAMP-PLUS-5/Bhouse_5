import { NextRequest, NextResponse } from 'next/server'
import { EmailVerifyUseCase } from '@be/application/auth/email-verify/usecases/EmailVerifyUseCase'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    const usecase = new EmailVerifyUseCase(new AuthRepositoryImpl())
    const result = await usecase.execute({ email })

    if (result.status !== 200) {
      return NextResponse.json(
        {
          error: result.message,
          isAvailable: result.isAvailable,
        },
        { status: result.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      isAvailable: result.isAvailable,
    })
  } catch (error: any) {
    console.error('Email Verify API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
