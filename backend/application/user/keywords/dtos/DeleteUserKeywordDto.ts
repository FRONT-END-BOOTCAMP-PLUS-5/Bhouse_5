// backend/application/user/keywords/dtos/DeleteUserKeywordDto.ts

/**
 * 사용자 키워드 삭제를 위한 입력 DTO입니다.
 */
export interface DeleteUserKeywordDto {
  userId: string
  keywordId: number
}
