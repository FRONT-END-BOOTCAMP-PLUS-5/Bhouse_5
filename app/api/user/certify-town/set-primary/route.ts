import { verifyToken } from '@bUtils/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = verifyToken(req)
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { town } = body

    if (!town) {
      return NextResponse.json({ message: 'town is required' }, { status: 400 })
    }

    // ✅ 실제 로직: DB에서 사용자 ID 기반으로 해당 town을 대표로 설정
    // 예: await setPrimaryTown(userId, town)

    console.log(`[API] set primary town to: ${town}`)

    return NextResponse.json({ message: 'Primary town set' }, { status: 200 })
  } catch (err) {
    console.error('set-primary API error:', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
