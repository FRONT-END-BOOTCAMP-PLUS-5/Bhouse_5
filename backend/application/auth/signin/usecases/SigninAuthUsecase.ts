// backend/application/auth/signin/usecases/SigninAuthUsecase.ts
import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { SigninAuthDto } from '../dtos/SigninAuthDto'
import { SigninAuthResponseDto } from '../dtos/SigninAuthResponseDto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '@be/domain/entities/User'

export class SigninAuthUsecase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(authHeader: string | null): Promise<SigninAuthResponseDto> {
    // 1. Basic Auth 헤더 검증 및 파싱
    const parsedCredentials = this.parseBasicAuth(authHeader)
    if (parsedCredentials.error) {
      return parsedCredentials.error
    }

    const { email, password } = parsedCredentials.data!

    // 2. 입력값 검증
    const validationError = this.validateInput(email, password)
    if (validationError) return validationError

    // 3. 유저 조회 (email 또는 username으로)
    const user = await this.authRepository.findByEmailOrUsername(email, email)
    if (!user) {
      return {
        message: '존재하지 않는 사용자입니다.',
        status: 401,
        error: 'USER_NOT_FOUND',
      }
    }

    // 4. 비밀번호 검증
    const passwordValidation = await this.validatePassword(password, user.password)
    if (passwordValidation) return passwordValidation

    // 5. JWT 토큰 생성 및 응답
    return this.createSuccessResponse(user)
  }

  private parseBasicAuth(authHeader: string | null): {
    data?: { email: string; password: string }
    error?: SigninAuthResponseDto
  } {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return {
        error: {
          message: 'Authorization header is missing or not Basic.',
          status: 401,
          error: 'UNAUTHORIZED',
        },
      }
    }

    try {
      const base64Credentials = authHeader.split(' ')[1]
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
      const [email, password] = credentials.split(':')

      if (!email || !password) {
        return {
          error: {
            message: 'Invalid Basic Auth format.',
            status: 400,
            error: 'INVALID_AUTH_FORMAT',
          },
        }
      }

      return { data: { email, password } }
    } catch (error) {
      return {
        error: {
          message: 'Invalid Basic Auth encoding.',
          status: 400,
          error: 'INVALID_AUTH_ENCODING',
        },
      }
    }
  }

  private validateInput(email: string, password: string): SigninAuthResponseDto | null {
    if (!email || !password) {
      return {
        message: '이메일과 비밀번호를 모두 입력해주세요.',
        status: 400,
        error: 'MISSING_REQUIRED_FIELDS',
      }
    }

    // Basic Auth 형식 검증 (email:password)
    if (email.includes(':')) {
      return {
        message: '잘못된 인증 형식입니다.',
        status: 400,
        error: 'INVALID_AUTH_FORMAT',
      }
    }

    return null
  }

  private async validatePassword(inputPassword: string, hashedPassword: string): Promise<SigninAuthResponseDto | null> {
    const isPasswordValid = await bcrypt.compare(inputPassword, hashedPassword)
    if (!isPasswordValid) {
      return {
        message: '비밀번호가 일치하지 않습니다.',
        status: 401,
        error: 'INVALID_PASSWORD',
      }
    }
    return null
  }

  private createSuccessResponse(user: User): SigninAuthResponseDto {
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

    if (!jwtSecret) {
      return {
        message: '서버 설정 오류가 발생했습니다.',
        status: 500,
        error: 'JWT_SECRET_NOT_SET',
      }
    }

    if (!refreshTokenSecret) {
      return {
        message: '서버 설정 오류가 발생했습니다.',
        status: 500,
        error: 'JWT_REFRESH_SECRET_NOT_SET',
      }
    }

    const now = Math.floor(Date.now() / 1000)

    // Access Token (1시간) - roles는 단일 roleId
    const accessTokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roles: user.userRole ? [user.userRole.roleId] : [],
      type: 'access',
      iat: now,
      exp: now + 1 * 60 * 60, // 1시간
    }

    // Refresh Token (2일)
    const refreshTokenPayload = {
      userId: user.id,
      type: 'refresh',
      iat: now,
      exp: now + 2 * 24 * 60 * 60, // 2일
    }

    const accessToken = jwt.sign(accessTokenPayload, jwtSecret)
    const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret)

    return {
      message: '로그인이 성공했습니다.',
      status: 200,
      accessToken,
      refreshToken,
    }
  }
}
