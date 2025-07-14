import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { EmailFindRequestDto, EmailFindResponseDto } from '../dtos/EmailFindDto'

export class EmailFindUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(requestDto: EmailFindRequestDto): Promise<EmailFindResponseDto> {
    // 1. 입력값 검증
    const validationError = this.validateInput(requestDto)
    if (validationError) return validationError

    try {
      // 2. username과 phone으로 사용자 조회
      const user = await this.authRepository.emailFind(requestDto.username, requestDto.phone)

      if (!user) {
        return {
          message: '해당 정보와 일치하는 사용자를 찾을 수 없습니다.',
          status: 404,
          error: 'USER_NOT_FOUND',
        }
      }

      // 3. 성공 응답
      return {
        message: '이메일 찾기가 성공했습니다.',
        status: 200,
        email: user.email,
      }
    } catch (error) {
      console.error('EmailFindUseCase Error:', error)
      return {
        message: '서버 오류가 발생했습니다.',
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
      }
    }
  }

  private validateInput(requestDto: EmailFindRequestDto): EmailFindResponseDto | null {
    if (!requestDto.username || !requestDto.phone) {
      return {
        message: '사용자명과 전화번호를 모두 입력해주세요.',
        status: 400,
        error: 'MISSING_REQUIRED_FIELDS',
      }
    }

    // 전화번호 형식 검증 (기본적인 형식만 체크)
    const phoneRegex = /^[0-9-+()\s]+$/
    if (!phoneRegex.test(requestDto.phone)) {
      return {
        message: '올바른 전화번호 형식을 입력해주세요.',
        status: 400,
        error: 'INVALID_PHONE_FORMAT',
      }
    }

    return null
  }
}
