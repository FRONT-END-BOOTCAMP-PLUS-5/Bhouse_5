import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { LoginSSOAuthDto } from '../dtos/SigninSSOAuthDto'
import { SigninAuthResponseDto } from '../dtos/SigninAuthResponseDto'

export class LoginSSOAuthUsecase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: LoginSSOAuthDto): Promise<SigninAuthResponseDto> {
    try {
      const user = await this.authRepo.findByProvider(dto.provider, dto.providerId)
      if (!user) {
        return {
          message: '등록된 사용자가 없습니다.',
          status: 404,
          error: 'USER_NOT_FOUND',
        }
      }

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
      const accessTokenMaxAge = 60 * 60
      const refreshTokenMaxAge = 2 * 24 * 60 * 60

      const encoder = new TextEncoder()
      const accessSecret = encoder.encode(jwtSecret)
      const refreshSecret = encoder.encode(refreshTokenSecret)

      const accessToken = await new SignJWT({
        userId: user.id,
        email: user.email,
        roleId: user.userRole?.roles.role_id.toString(),
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${accessTokenMaxAge}s`)
        .sign(accessSecret)

      const refreshToken = await new SignJWT({
        userId: user.id,
        type: 'refresh',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${refreshTokenMaxAge}s`)
        .sign(refreshSecret)

      const cookieStore = cookies()
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
