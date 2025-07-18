import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 400 })
    }

    // 1. refresh token 검증
    let payload: any
    try {
      const { payload: verifiedPayload } = await jwtVerify(refreshToken, new TextEncoder().encode(REFRESH_SECRET))
      payload = verifiedPayload
    } catch (e) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
    }

    // 2. 새 access token 발급
    const now = Math.floor(Date.now() / 1000)
    const accessTokenMaxAge = 1 * 60 * 60 // 1시간
    const accessTokenPayload = {
      userId: payload.userId,
      email: payload.email, // email이 payload에 없으면 생략
      roleId: payload.roleId || '3', // 기본값 3
      exp: now + accessTokenMaxAge,
    }
    const accessToken = await new SignJWT(accessTokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(`${accessTokenMaxAge}s`)
      .sign(new TextEncoder().encode(ACCESS_SECRET))

    // 3. (선택) refresh token도 재발급할지 결정
    // 여기서는 기존 refresh token이 유효하면 그대로 사용

    // 4. 쿠키로도 세팅 (선택)
    const response = NextResponse.json({ accessToken })
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: accessTokenMaxAge,
    })
    return response
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
