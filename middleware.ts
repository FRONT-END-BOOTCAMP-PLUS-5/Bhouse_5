import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { match } from 'path-to-regexp'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!
const matchersForAuth = ['/my{/*path}']
const matchersForSignIn = ['/auth{/*path}']

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

//TODO: 토큰 재발급 로직 추가
// api 검증 로직 추가(토큰 재발급 제외)
// 프론트 -> 미들웨어 -> 백엔드(401 에러)

//미들웨어 선언, 백엔드 요청 (토큰검증해달라) -> 리다이랙트

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // 1. 인증 상태 확인 및 토큰 재발급
  let isAuth = await verifyAccessToken(accessToken) // true or false
  let newAccessToken: string | undefined

  if (!isAuth && refreshToken) {
    // accessToken 재발급
    newAccessToken = await getNewAccessToken(request, refreshToken) // token or undefined
    if (newAccessToken) {
      isAuth = await verifyAccessToken(newAccessToken)
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
      })
    }
  }

  if (isMatch(pathname, matchersForAuth)) {
    // 인증이 필요한 페이지 접근 제어!
    if (!isAuth) return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${pathname}`, request.url))
    return response
  }

  if (isMatch(pathname, matchersForSignIn)) {
    // 인증 후 회원가입 및 로그인 접근 제어!
    if (isAuth) return NextResponse.redirect(new URL('/', request.url))
    return response
  }

  return response
}

// 경로 일치 확인!
function isMatch(pathname: string, urls: string[]) {
  return urls.some((url) => !!match(url)(pathname))
}

async function verifyAccessToken(token: string | undefined) {
  if (!token) return false

  try {
    await jwtVerify(token, new TextEncoder().encode(ACCESS_SECRET))
    return true
  } catch {
    return false
  }
}

async function getNewAccessToken(request: NextRequest, refreshToken: string | undefined) {
  const data = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  }).then((res) => res.json())

  return data.accessToken
}
