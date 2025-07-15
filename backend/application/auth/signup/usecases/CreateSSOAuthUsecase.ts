import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { CreateSSOAuthDto } from '../dtos/CreateSSOAuthDto'
import { User } from '@be/domain/entities/User'
import { UserRole } from '@be/domain/entities/UserRole'
import { Role } from '@be/domain/entities/Role'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { SigninAuthResponseDto } from '../../signin/dtos/SigninAuthResponseDto'

export class CreateSSOAuthUsecase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: CreateSSOAuthDto): Promise<SigninAuthResponseDto> {
    try {
      // 1. 기존 사용자 조회
      const existingUser = await this.authRepo.findByProvider(dto.provider, dto.providerId)

      if (existingUser) {
        return {
          message: '이미 가입된 사용자입니다.',
          status: 200,
        }
      }

      // 1. 회원 생성
      const newUser = new User(
        '', // userId (자동 생성)
        dto.username,
        '', // 비밀번호 없음 (SSO)
        dto.email,
        dto.nickname || dto.username,
        new Date(), // createdAt
        new Date(), // updatedAt
        'APPROVED',
        dto.profileImgUrl || null, // image
        [],
        undefined,
        dto.provider,
        dto.providerId,
        new UserRole(new Role(2, 'USER')), // USER role
      )

      await this.authRepo.signup(newUser, 2)

      // 2. Token 발급 및 쿠키 저장
      const savedUser = await this.authRepo.findByProvider(dto.provider, dto.providerId)
      if (!savedUser) {
        return {
          message: '회원가입 후 유저 조회 실패',
          status: 500,
          error: 'USER_FETCH_FAILED',
        }
      }

      const now = Math.floor(Date.now() / 1000)
      const accessTokenMaxAge = 60 * 60
      const refreshTokenMaxAge = 2 * 24 * 60 * 60

      const jwtSecret = process.env.ACCESS_TOKEN_SECRET!
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!

      const accessTokenPayload = {
        userId: savedUser.id,
        email: savedUser.email,
        roleId: savedUser.userRole?.roles.role_id.toString(),
        exp: now + accessTokenMaxAge,
      }

      const refreshTokenPayload = {
        userId: savedUser.id,
        type: 'refresh',
        iat: now,
        exp: now + refreshTokenMaxAge,
      }

      const accessToken = jwt.sign(accessTokenPayload, jwtSecret)
      const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret)

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
