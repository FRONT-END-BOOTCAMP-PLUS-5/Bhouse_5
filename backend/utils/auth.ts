//구조가 이렇습니다요~
//이제 토큰 검증이 필요한 곳에서 verifyToken() 함수를 직접 사용하면 됩니다.
//사용 예제는 app/api/user/profile/route.ts 참고하시면 됩니다.
// ├── domain/repositories/TokenRepository.ts     # 인터페이스
// ├── infrastructure/repositories/JwtTokenRepository.ts  # 구현체
// └── utils/auth.ts                              # 편의 함수

import { NextRequest } from 'next/server'
import { JwtTokenRepository } from '../infrastructure/repositories/JwtTokenRepository'
import { DecodedToken } from '../domain/repositories/TokenRepository'

const tokenRepository = new JwtTokenRepository()

export function verifyToken(request: NextRequest): DecodedToken | null {
  const token = tokenRepository.extractTokenFromRequest(request)
  if (!token) {
    return null
  }
  return tokenRepository.verifyToken(token)
}
