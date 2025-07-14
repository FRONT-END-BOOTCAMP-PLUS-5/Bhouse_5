import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { PasswordResetRequestDto, PasswordResetResponseDto } from '../dtos/PasswordResetDto'
import bcrypt from 'bcrypt'

export class PasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(requestDto: PasswordResetRequestDto): Promise<PasswordResetResponseDto> {
    try {
      // 1. 입력값 검증
      const validationError = this.validateInput(requestDto)
      if (validationError) return validationError

      // 2. 사용자 조회
      const user = await this.authRepository.findUserById(requestDto.userId)
      if (!user) {
        return {
          message: '존재하지 않는 사용자입니다.',
          status: 404,
          error: 'USER_NOT_FOUND',
        }
      }

      // 3. 새 비밀번호 해싱
      const saltRounds = Number(process.env.SALT_ROUNDS) || 11
      const hashedNewPassword = await bcrypt.hash(requestDto.newPassword, saltRounds)

      // 4. 비밀번호 재설정
      await this.authRepository.passwordReset(requestDto.userId, hashedNewPassword)

      return {
        message: '비밀번호가 성공적으로 변경되었습니다.',
        status: 200,
        success: true,
      }
    } catch (error) {
      console.error('PasswordResetUseCase Error:', error)
      return {
        message: '서버 오류가 발생했습니다.',
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
      }
    }
  }

  private validateInput(requestDto: PasswordResetRequestDto): PasswordResetResponseDto | null {
    if (!requestDto.userId) {
      return {
        message: '사용자 ID가 필요합니다.',
        status: 400,
        error: 'MISSING_USER_ID',
      }
    }

    if (!requestDto.newPassword) {
      return {
        message: '새 비밀번호를 입력해주세요.',
        status: 400,
        error: 'MISSING_NEW_PASSWORD',
      }
    }

    // 새 비밀번호 길이 검증
    if (requestDto.newPassword.length < 7) {
      return {
        message: '새 비밀번호는 최소 6자 이상이어야 합니다.',
        status: 400,
        error: 'PASSWORD_TOO_SHORT',
      }
    }

    // 새 비밀번호 복잡도 검증 (영문, 숫자 포함)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/
    if (!passwordRegex.test(requestDto.newPassword)) {
      return {
        message: '새 비밀번호는 영문과 숫자를 모두 포함해야 합니다.',
        status: 400,
        error: 'PASSWORD_TOO_SIMPLE',
      }
    }

    return null
  }
}
