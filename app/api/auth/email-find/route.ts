import { NextRequest, NextResponse } from 'next/server'
import { EmailFindUseCase } from '@be/application/auth/email-find/usecases/EmailFindUseCase'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, phone } = body

    const usecase = new EmailFindUseCase(new AuthRepositoryImpl())
    const result = await usecase.execute({ username, phone })

    if (result.status !== 200) {
      return NextResponse.json({ error: result.message }, { status: result.status })
    }

    return NextResponse.json({ success: true, email: result.email })
  } catch (error: any) {
    console.error('Email Find API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
