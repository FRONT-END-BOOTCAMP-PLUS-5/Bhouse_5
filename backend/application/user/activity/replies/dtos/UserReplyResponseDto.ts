// backend/application/user/activity/replies/dtos/UserReplyResponseDto.ts

/**
 * 사용자 댓글 조회 결과로 반환되는 개별 댓글 데이터의 DTO입니다.
 */
export interface UserReplyResponseDto {
  reply_id: number
  text: string // content에 해당
  parent_reply_id: number | null
  created_at: string // ISO 8601 문자열
}

/**
 * 사용자 댓글 목록 조회 결과로 반환되는 전체 응답 DTO입니다.
 */
export interface GetUserRepliesResponseDto {
  data: UserReplyResponseDto[]
  total: number // 총 댓글 개수
}
