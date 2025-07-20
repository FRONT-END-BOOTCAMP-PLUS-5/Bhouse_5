import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@bUtils/auth'

export function GET(req: NextRequest) {
  try {
    const payload = verifyToken(req)
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ userId: payload.userId })
  } catch (err) {
    console.error('[AuthMeRoute Error]', err)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
