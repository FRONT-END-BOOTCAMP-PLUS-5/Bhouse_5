import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { PasswordFindRequestDto, PasswordFindResponseDto } from '../dtos/PasswordFindDto'

export class PasswordFindUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(requestDto: PasswordFindRequestDto): Promise<PasswordFindResponseDto> {
    // 1. 입력값 검증
    const validationError = this.validateInput(requestDto)
    if (validationError) return validationError

    try {
      // 2. username, email, phone으로 사용자 조회 및 검증
      const user = await this.authRepository.passwordFind(requestDto.username, requestDto.email, requestDto.phone)

      if (!user) {
        return {
          message: '해당 정보와 일치하는 사용자를 찾을 수 없습니다.',
          status: 404,
          error: 'USER_NOT_FOUND',
          isVerified: false,
        }
      }

      // 3. 성공 응답 - 사용자 검증 완료
      return {
        message: '사용자 검증이 완료되었습니다.',
        status: 200,
        userId: user.id,
        isVerified: true,
      }
    } catch (error) {
      console.error('PasswordFindUseCase Error:', error)
      return {
        message: '서버 오류가 발생했습니다.',
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
        isVerified: false,
      }
    }
  }

  private validateInput(requestDto: PasswordFindRequestDto): PasswordFindResponseDto | null {
    if (!requestDto.username || !requestDto.email || !requestDto.phone) {
      return {
        message: '사용자명, 이메일, 전화번호를 모두 입력해주세요.',
        status: 400,
        error: 'MISSING_REQUIRED_FIELDS',
        isVerified: false,
      }
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(requestDto.email)) {
      return {
        message: '올바른 이메일 형식을 입력해주세요.',
        status: 400,
        error: 'INVALID_EMAIL_FORMAT',
        isVerified: false,
      }
    }

    // 전화번호 형식 검증 (기본적인 형식만 체크)
    const phoneRegex = /^[0-9-+()\s]+$/
    if (!phoneRegex.test(requestDto.phone)) {
      return {
        message: '올바른 전화번호 형식을 입력해주세요.',
        status: 400,
        error: 'INVALID_PHONE_FORMAT',
        isVerified: false,
      }
    }

    return null
  }
}
