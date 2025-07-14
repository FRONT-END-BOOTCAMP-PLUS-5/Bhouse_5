import { NextRequest, NextResponse } from 'next/server'
import { PasswordResetUseCase } from '@be/application/auth/password-reset/usecases/PasswordResetUseCase'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, newPassword } = body

    const usecase = new PasswordResetUseCase(new AuthRepositoryImpl())
    const result = await usecase.execute({ userId, newPassword })

    if (result.status !== 200) {
      return NextResponse.json(
        {
          error: result.error,
          message: result.message,
        },
        { status: result.status },
      )
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
    })
  } catch (error: any) {
    console.error('Password Reset API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
