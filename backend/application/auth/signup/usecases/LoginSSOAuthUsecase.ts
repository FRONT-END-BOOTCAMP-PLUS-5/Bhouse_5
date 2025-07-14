import { AuthRepository } from "@be/domain/repositories/AuthRepository";
import { LoginSSOAuthDto } from "../dtos/LoginSSOAuthDto";
import { CreateAuthResponseDto } from "../dtos/CreateAuthDto";
import jwt from "jsonwebtoken";

export class LoginSSOAuthUsecase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(dto: LoginSSOAuthDto): Promise<CreateAuthResponseDto> {
    try {
      const user = await this.authRepo.findByProvider(dto.provider, dto.providerId);

      if (!user) {
        return {
          message: "등록된 사용자가 없습니다.",
          status: 404,
        };
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.userRole.roleId,
        },
        process.env.JWT_SECRET ?? "default_secret",
        { expiresIn: "1h" }
      );

      return {
        message: "로그인 성공",
        status: 200,
        token,
      };
    } catch (error) {
      return {
        message: "로그인 실패",
        status: 500,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
