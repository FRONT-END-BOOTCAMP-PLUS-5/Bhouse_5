// backend/application/auth/signin/usecases/SigninAuthUsecase.ts
import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { SigninAuthDto } from '../dtos/SigninAuthDto'
import { SigninAuthResponseDto } from '../dtos/SigninAuthResponseDto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '@be/domain/entities/User'

export class SigninAuthUsecase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: SigninAuthDto): Promise<SigninAuthResponseDto> {
    // 1. 입력값 검증
    if (!dto.email || !dto.password) {
      return {
        message: '이메일과 비밀번호를 모두 입력해주세요.',
        status: 400,
        error: 'MISSING_REQUIRED_FIELDS',
      }
    }

    // 2. 유저 조회
    const user = await this.authRepository.findByEmailOrUsername(dto.email, '')
    if (!user) {
      return {
        message: '존재하지 않는 사용자입니다.',
        status: 401,
        error: 'USER_NOT_FOUND',
      }
    }

    // 3. 비밀번호 검증
    const passwordValidation = await this.validatePassword(dto.password, user.password)
    if (passwordValidation) return passwordValidation

    // 4. JWT 토큰 생성 및 응답
    return this.createSuccessResponse(user)
  }

  private validateInput(dto: SigninAuthDto): SigninAuthResponseDto | null {
    if (!dto.email || !dto.password) {
      return {
        message: '이메일과 비밀번호를 모두 입력해주세요.',
        status: 400,
        error: 'MISSING_REQUIRED_FIELDS',
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
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return {
        message: '서버 설정 오류가 발생했습니다.',
        status: 500,
        error: 'JWT_SECRET_NOT_SET',
      }
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roles: user.userRole || [],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    }

    const token = jwt.sign(tokenPayload, jwtSecret)

    return {
      message: '로그인이 성공했습니다.',
      status: 200,
      user: {
        user_id: user.id,
        email: user.email,
        username: user.username,
        roles: user.userRole || [],
      },
      token,
    }
  }
}
