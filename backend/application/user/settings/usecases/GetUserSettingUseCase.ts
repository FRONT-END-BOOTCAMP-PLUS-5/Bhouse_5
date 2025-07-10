// backend/application/user/settings/usecases/GetUserSettingUseCase.ts

import UserSettingRepository from "@domain/repositories/UserSettingRepository";
import { GetUserSettingQueryDto } from "../dtos/GetUserSettingQueryDto";
import { UserSettingResponseDto } from "../dtos/UserSettingResponseDto";

/**
 * 특정 사용자의 알림 설정을 조회하는 유즈케이스입니다.
 */
export class GetUserSettingUseCase {
  private userSettingRepository: UserSettingRepository;

  constructor(userSettingRepository: UserSettingRepository) {
    this.userSettingRepository = userSettingRepository;
  }

  /**
   * 사용자 ID를 통해 알림 설정을 조회하고 DTO로 변환하여 반환합니다.
   * @param queryDto 조회 조건을 담은 DTO (userId)
   * @returns UserSettingResponseDto 또는 null (설정이 없는 경우)
   */
  async execute(queryDto: GetUserSettingQueryDto): Promise<UserSettingResponseDto | null> {
    const userSetting = await this.userSettingRepository.findByUserId(queryDto.userId);

    if (!userSetting) {
      return null; // 설정이 없는 경우 null 반환
    }

    // 엔티티를 응답 DTO로 변환 (boolean -> 'Y'/'N')
    return {
      reply: userSetting.replyAlarm ? 'Y' : 'N',
      keyword: userSetting.keywordAlarm ? 'Y' : 'N',
    };
  }
}