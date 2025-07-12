import { verifyToken } from '@bUtils/auth'
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

// 이 함수는 내부에서 `await`를 사용하는 경우 `async`로 표시될 수 있습니다
export function middleware(request: NextRequest) {
  //   const decodedToken = verifyToken(request)
  //   console.log(decodedToken)
  //   if (!decodedToken) {
  //     return NextResponse.redirect(new URL('/login', request.url))
  //   }
}
