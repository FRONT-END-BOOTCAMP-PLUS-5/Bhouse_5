import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { TokenRepository, DecodedToken } from '../../domain/repositories/TokenRepository'

export class JwtTokenRepository implements TokenRepository {
  private readonly secret: string

  constructor() {
    this.secret = process.env.ACCESS_TOKEN_SECRET!
    if (!this.secret) {
      throw new Error('ACCESS_TOKEN_SECRET environment variable is required')
    }
  }

  extractTokenFromRequest(request: NextRequest): string | null {
    const cookie = request.cookies.get('accessToken')
    if (cookie?.value) {
      return cookie.value
    }

    return null
    // const authHeader = request.headers.get('authorization')
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return null
    // }
    // return authHeader.substring(7) // 'Bearer ' 제거
  }

  verifyToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, this.secret) as DecodedToken

      // 토큰 만료 확인
      if (decoded.exp * 1000 < Date.now()) {
        return null
      }

      return decoded
    } catch (error) {
      return null
    }
  }
}
