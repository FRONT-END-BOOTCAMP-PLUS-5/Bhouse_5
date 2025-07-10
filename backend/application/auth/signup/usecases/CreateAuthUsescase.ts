import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { CreateAuthDto, CreateAuthResponseDto } from '../dtos/CreateAuthDto'
import bcrypt from 'bcrypt'
import User from '@be/domain/entities/User'
import UserRole from '@be/domain/entities/UserRole'

export class CreateAuthUsecase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: CreateAuthDto): Promise<CreateAuthResponseDto> {
    try {
      // 필수값 검증
      const validationResult = this.validateRequiredFields(dto)
      if (validationResult) return validationResult

      // 이메일/username 중복 체크
      const duplicateCheck = await this.checkDuplicateUser(dto)
      if (duplicateCheck) return duplicateCheck

      // 회원가입 실행
      const user = await this.createUser(dto)
      await this.authRepository.signup(user, dto.roles)

      return { message: '회원가입 성공', status: 201 }
    } catch (error) {
      return {
        message: '서버 오류',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private validateRequiredFields(dto: CreateAuthDto): CreateAuthResponseDto | null {
    if (!dto.username) {
      return { message: '필수값 누락: username', status: 400 }
    }
    if (!dto.email) {
      return { message: '필수값 누락: email', status: 400 }
    }
    if (!dto.password) {
      return { message: '필수값 누락: password', status: 400 }
    }
    if (!dto.roles || ![1, 2, 3].includes(dto.roles)) {
      return { message: '필수값 누락 또는 잘못된 값: roles', status: 400 }
    }
    return null
  }

  private async checkDuplicateUser(dto: CreateAuthDto): Promise<CreateAuthResponseDto | null> {
    const existingUser = await this.authRepository.findByEmailOrUsername(dto.email, dto.username)
    if (existingUser) {
      return { message: '이미 존재하는 이메일 또는 아이디입니다.', status: 409 }
    }
    return null
  }

  private async createUser(dto: CreateAuthDto): Promise<User> {
    const saltRounds = Number(process.env.SALT_ROUNDS) || 11
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds)

    return new User(
      '', // user_id는 DB에서 자동 생성
      dto.username,
      hashedPassword,
      dto.email,
      dto.nickname || '',
      new Date(),
      new Date(),
      dto.profile_img_url || null,
      new UserRole('', dto.roles), // 임시 UserRole - 나중에 실제 데이터로 교체
      undefined, // userAlarms
      dto.phone,
      dto.provider,
      dto.provider_id,
    )
  }
}
