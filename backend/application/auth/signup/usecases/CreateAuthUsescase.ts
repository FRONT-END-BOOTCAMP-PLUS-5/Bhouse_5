import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { CreateAuthDto, CreateAuthResponseDto } from '../dtos/CreateAuthDto'
import bcrypt from 'bcrypt'
import { UserRole } from '@be/domain/entities/UserRole'
import { User } from '@be/domain/entities/User'
import { Role } from '@be/domain/entities/Role'

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
      await this.authRepository.signup(user, dto.roleId)

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
    // roleId가 없으면 기본값 2 (일반 사용자)로 설정
    if (!dto.roleId) {
      dto.roleId = 2
    }
    if (![1, 2, 3].includes(dto.roleId)) {
      return { message: '잘못된 roleId 값입니다. (1, 2, 3 중 하나여야 합니다)', status: 400 }
    }
    return null
  }

  private async checkDuplicateUser(dto: CreateAuthDto): Promise<CreateAuthResponseDto | null> {
    const existingUser = await this.authRepository.findUser(dto.email, dto.username)
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
      new Date(), // updatedAt
      null, // deletedAt
      dto.profile_img_url || null,
      dto.phone,
      dto.provider,
      dto.provider_id,
      new UserRole(new Role(dto.roleId, '')), // 임시 UserRole - 나중에 실제 데이터로 교체
    )
  }
}
