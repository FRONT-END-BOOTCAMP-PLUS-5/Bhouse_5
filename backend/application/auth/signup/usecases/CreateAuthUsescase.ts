import { User } from '@be/domain/entities/User'
import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { CreateAuthDto, CreateAuthResponseDto } from '../dtos/CreateAuthDto'
import bcrypt from 'bcrypt'

export class CreateAuthUsecase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: CreateAuthDto): Promise<CreateAuthResponseDto> {
    try {
      // 필수값 검증
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

      // 이메일/username 중복 체크
      const existingUser = await this.authRepository.findByEmailOrUsername(dto.email, dto.username)
      if (existingUser) {
        return { message: '이미 존재하는 이메일 또는 아이디입니다.', status: 409 }
      }

      // 비밀번호 해시
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds)

      // User 엔티티 생성
      const user = new User(
        '', // user_id는 DB에서 자동 생성
        dto.username,
        dto.email,
        hashedPassword,
        dto.nickname,
        dto.phone,
        dto.profile_img_url,
        dto.provider,
        dto.provider_id,
        new Date().toISOString(),
        new Date().toISOString(),
      )

      // 회원가입 실행
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
}
