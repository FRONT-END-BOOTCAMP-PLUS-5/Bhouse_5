// backend/application/user/settings/usecases/UpdateUserSettingUseCase.ts

import UserSettingRepository from "@domain/repositories/UserSettingRepository";
import { UpdateUserSettingDto } from "../dtos/UpdateUserSettingDto";
import { UserSettingResponseDto } from "../dtos/UserSettingResponseDto";
import { UserSetting } from "@domain/entities/UserSetting";

/**
 * 특정 사용자의 알림 설정을 업데이트하는 유즈케이스입니다.
 */
export class UpdateUserSettingUseCase {
  private userSettingRepository: UserSettingRepository;

  constructor(userSettingRepository: UserSettingRepository) {
    this.userSettingRepository = userSettingRepository;
  }

  /**
   * 사용자 알림 설정을 업데이트합니다.
   * @param dto 업데이트할 설정 데이터를 담은 DTO
   * @returns 업데이트된 알림 설정 정보를 담은 DTO
   * @throws Error 해당 유저의 알림 설정을 찾을 수 없는 경우
   */
  async execute(dto: UpdateUserSettingDto): Promise<UserSettingResponseDto> {
    // 1. 현재 사용자 설정을 조회합니다.
    const existingSetting = await this.userSettingRepository.findByUserId(dto.userId);

    if (!existingSetting) {
      // 설정이 없는 경우, 새로 생성할지 아니면 에러를 발생시킬지 정책 결정
      // 기존 route.ts 의도에 따라 "찾을 수 없거나 업데이트할 권한이 없습니다." 에러 발생
      throw new Error('해당 유저의 알림 설정을 찾을 수 없거나 업데이트할 권한이 없습니다.');
    }

    // 2. DTO의 'Y'/'N' 값을 boolean으로 변환하여 엔티티 업데이트
    const newKeywordAlarm = dto.keyword === 'Y' ? true : (dto.keyword === 'N' ? false : undefined);
    const newReplyAlarm = dto.reply === 'Y' ? true : (dto.reply === 'N' ? false : undefined);

    existingSetting.updateSettings(newKeywordAlarm, newReplyAlarm);

    // 3. 업데이트된 엔티티를 레포지토리를 통해 저장 (업데이트)
    const updatedSetting = await this.userSettingRepository.update(existingSetting);

    // 4. 업데이트된 엔티티를 응답 DTO로 변환하여 반환
    return {
      reply: updatedSetting.replyAlarm ? 'Y' : 'N',
      keyword: updatedSetting.keywordAlarm ? 'Y' : 'N',
    };
  }
}