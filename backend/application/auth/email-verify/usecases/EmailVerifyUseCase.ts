import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { EmailVerifyDto, EmailVerifyResponseDto } from '../dtos/EmailVerifyDto'

export class EmailVerifyUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: EmailVerifyDto): Promise<EmailVerifyResponseDto> {
    try {
      // 이메일 형식 검증
      const validationResult = this.validateEmail(dto.email)
      if (validationResult) return validationResult

      // 이메일 중복 체크
      const existingUser = await this.authRepository.findByEmailOrUsername(dto.email, dto.email)

      if (existingUser) {
        return {
          message: '이미 사용 중인 이메일입니다.',
          status: 409,
          isAvailable: false,
        }
      }

      return {
        message: '사용 가능한 이메일입니다.',
        status: 200,
        isAvailable: true,
      }
    } catch (error) {
      return {
        message: '서버 오류가 발생했습니다.',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private validateEmail(email: string): EmailVerifyResponseDto | null {
    if (!email) {
      return {
        message: '이메일을 입력해주세요.',
        status: 400,
        error: 'EMAIL_REQUIRED',
      }
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        message: '올바른 이메일 형식을 입력해주세요.',
        status: 400,
        error: 'INVALID_EMAIL_FORMAT',
      }
    }

    return null
  }
}
