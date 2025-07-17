// backend/application/auth/signin/usecases/LoginSSOAuthUsecase.ts

import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { LoginSSOAuthDto } from '../dtos/SigninSSOAuthDto'
import { SigninAuthResponseDto } from '../dtos/SigninAuthResponseDto'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export class LoginSSOAuthUsecase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: LoginSSOAuthDto): Promise<SigninAuthResponseDto> {
    try {
      console.log('[SSO Login] provider:', dto.provider)
      console.log('[SSO Login] providerId:', dto.providerId)

      const user = await this.authRepo.findByProvider(dto.provider, dto.providerId)
      console.log('[SSO Login] user:', user)

      if (!user) {
        return {
          message: '등록된 사용자가 없습니다.',
          status: 404,
          error: 'USER_NOT_FOUND',
        }
      }

      const cookieStore = cookies()
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

      if (!jwtSecret || !refreshTokenSecret) {
        return {
          message: '서버 설정 오류가 발생했습니다.',
          status: 500,
          error: 'JWT_SECRET_NOT_SET',
        }
      }

      const now = Math.floor(Date.now() / 1000)
      const accessTokenMaxAge = 60 * 60 // 1시간
      const refreshTokenMaxAge = 2 * 24 * 60 * 60 // 2일

      const accessTokenPayload = {
        userId: user.id,
        email: user.email,
        roleId: user.userRole?.roles.role_id.toString(),
        exp: now + accessTokenMaxAge,
      }

      const refreshTokenPayload = {
        userId: user.id,
        type: 'refresh',
        iat: now,
        exp: now + refreshTokenMaxAge,
      }

      const accessToken = jwt.sign(accessTokenPayload, jwtSecret)
      const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret)

      ;(await cookieStore).set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: accessTokenMaxAge,
      })

      ;(await cookieStore).set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: refreshTokenMaxAge,
      })

      return {
        message: '로그인 성공',
        status: 200,
        accessToken,
        refreshToken,
      }
    } catch (error) {
      return {
        message: '로그인 실패',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
