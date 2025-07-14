import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')

    return NextResponse.json({ message: '로그아웃 성공' }, { status: 200 })
  } catch (error) {
    console.error('로그아웃 처리 중 오류 발생:', error)
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
