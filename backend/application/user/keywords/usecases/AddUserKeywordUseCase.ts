// backend/application/user/keywords/usecases/AddUserKeywordUseCase.ts

import UserKeywordRepository from "@domain/repositories/UserKeywordRepository";
import { UserKeyword } from "@domain/entities/UserKeyword";
import { AddUserKeywordDto } from "../dtos/AddUserKeywordDto";
import { UserKeywordDto } from "../dtos/UserKeywordDto";

/**
 * 새로운 사용자 커뮤니티 알림 키워드를 추가하는 유즈케이스입니다.
 */
export class AddUserKeywordUseCase {
  private userKeywordRepository: UserKeywordRepository;

  constructor(userKeywordRepository: UserKeywordRepository) {
    this.userKeywordRepository = userKeywordRepository;
  }

  async execute(dto: AddUserKeywordDto): Promise<UserKeywordDto> {
    const newUserKeyword = new UserKeyword(
      0, // keywordId는 DB에서 자동 생성
      dto.userId,
      dto.keyword, // AddUserKeywordDto에서는 keyword가 string이므로 그대로 사용
      new Date() // created_at은 현재 시간으로 설정
    );

    const savedKeyword = await this.userKeywordRepository.save(newUserKeyword);

    return {
      keywordId: savedKeyword.keywordId,
      keyword: savedKeyword.keyword,
      createdAt: savedKeyword.createdAt.toISOString(),
    };
  }
}