// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value
  if (!accessToken) {
    return NextResponse.json({ message: 'No token found' }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(ACCESS_SECRET))
    return NextResponse.json({
      userId: payload.userId,
      primaryTown: payload.primaryTown, // 👈 토큰에 담긴 정보 사용
      isLoggedIn: true,
    })
  } catch (err) {
    console.error('[AuthMeRoute Error]', err)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
