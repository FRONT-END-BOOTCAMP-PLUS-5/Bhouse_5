// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_ROUTE_REGEX = /^\/my(\/|$)/ // /my 또는 /my/anything
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!

async function verifyAccessToken(token: string) {
  try {
    await jwtVerify(token, new TextEncoder().encode(ACCESS_SECRET))
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. /my 또는 /my/로 시작하는 경로만 인증 필요
  if (AUTH_ROUTE_REGEX.test(pathname)) {
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    // 2. access token이 있으면 유효성 검사
    if (accessToken) {
      const isValid = await verifyAccessToken(accessToken)
      if (isValid) {
        return NextResponse.next()
      }
    }

    // 3. access token이 없고 refresh token만 있으면 재발급 시도
    if (refreshToken) {
      // refresh API 호출
      const res = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (res.ok) {
        const data = await res.json()
        const response = NextResponse.next()
        // 새 access token을 쿠키에 세팅
        response.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60, // 1시간
        })
        return response
      }
    }

    // 4. 둘 다 없거나 refresh token도 만료/유효하지 않으면 로그인 페이지로 리다이렉트
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    url.searchParams.set('redirect', pathname) // 원래 가려던 경로 저장
    return NextResponse.redirect(url)
  }

  // 인증 필요 없는 경로는 그대로 진행
  return NextResponse.next()
}
