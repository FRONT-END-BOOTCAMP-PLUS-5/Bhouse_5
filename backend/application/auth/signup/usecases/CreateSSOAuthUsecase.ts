import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { CreateSSOAuthDto } from '../dtos/CreateSSOAuthDto'
import { User } from '@be/domain/entities/User'
import { UserRole } from '@be/domain/entities/UserRole'
import { Role } from '@be/domain/entities/Role'
import { cookies } from 'next/headers'
import { SigninAuthResponseDto } from '../../signin/dtos/SigninAuthResponseDto'
import { SignJWT } from 'jose'

export class CreateSSOAuthUsecase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: CreateSSOAuthDto): Promise<SigninAuthResponseDto> {
    try {
      const existingUser = await this.authRepo.findByProvider(dto.provider, dto.providerId)

      if (existingUser) {
        return {
          message: '이미 가입된 사용자입니다.',
          status: 200,
        }
      }

      const newUser = new User(
        '',
        dto.username,
        '',
        dto.email,
        dto.nickname || dto.username,
        new Date(),
        new Date(),
        'APPROVED',
        dto.profileImgUrl || null,
        [],
        undefined,
        dto.provider,
        dto.providerId,
        new UserRole(new Role(2, 'USER')),
      )

      await this.authRepo.signup(newUser, 2)

      const savedUser = await this.authRepo.findByProvider(dto.provider, dto.providerId)
      if (!savedUser) {
        return {
          message: '회원가입 후 유저 조회 실패',
          status: 500,
          error: 'USER_FETCH_FAILED',
        }
      }

      const jwtSecret = process.env.ACCESS_TOKEN_SECRET
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

      if (!jwtSecret || !refreshTokenSecret) {
        return {
          message: 'JWT 시크릿이 설정되지 않았습니다.',
          status: 500,
          error: 'JWT_SECRET_NOT_SET',
        }
      }

      const now = Math.floor(Date.now() / 1000)
      const accessTokenMaxAge = 60 * 60 // 1시간
      const refreshTokenMaxAge = 2 * 24 * 60 * 60 // 2일

      const encoder = new TextEncoder()
      const accessSecret = encoder.encode(jwtSecret)
      const refreshSecret = encoder.encode(refreshTokenSecret)

      const accessToken = await new SignJWT({
        userId: savedUser.id,
        email: savedUser.email,
        roleId: savedUser.userRole?.roles.role_id.toString(),
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${accessTokenMaxAge}s`)
        .sign(accessSecret)

      const refreshToken = await new SignJWT({
        userId: savedUser.id,
        type: 'refresh',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${refreshTokenMaxAge}s`)
        .sign(refreshSecret)

      const cookieStore = cookies()
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: accessTokenMaxAge,
      })

      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: refreshTokenMaxAge,
      })

      return {
        message: 'SSO 회원가입 및 로그인 성공',
        status: 201,
        accessToken,
        refreshToken,
      }
    } catch (error) {
      return {
        message: '서버 오류',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
