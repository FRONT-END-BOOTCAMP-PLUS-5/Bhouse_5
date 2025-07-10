import { AuthRepository } from "@be/domain/repositories/AuthRepository";
import { CreateSSOAuthDto } from "../dtos/CreateSSOAuthDto";
import { CreateAuthResponseDto } from "../dtos/CreateAuthDto";
import User from "@be/domain/entities/User";
import UserRole from "@be/domain/entities/UserRole";

export class CreateSSOAuthUsecase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: CreateSSOAuthDto): Promise<CreateAuthResponseDto> {
    try {
      // 1. 기존 사용자 조회
      const existingUser = await this.authRepo.findByProvider(dto.provider, dto.providerId);

      // 2. 존재하면 로그인 처리 (토큰 발급 등)
      if (existingUser) {
        return {
          message: "이미 가입된 사용자입니다.",
          status: 200,
        };
      }

      // 3. 존재하지 않으면 신규 회원가입
      const newUser = new User(
        "", // userId (자동 생성)
        dto.username,
        "", // 비밀번호 없음 (SSO)
        dto.email,
        dto.nickname || dto.username,
        new Date(),
        new Date(),
        dto.profileImgUrl || null,
        new UserRole("", 2), // 일반 사용자 roleId = 2
        undefined, // userAlarms
        undefined, // phone
        dto.provider,
        dto.providerId
      );

      await this.authRepo.signup(newUser, 2); // 2: 기본 USER role

      return {
        message: "SSO 회원가입 성공",
        status: 201,
      };
    } catch (error) {
      return {
        message: "서버 오류",
        status: 500,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
