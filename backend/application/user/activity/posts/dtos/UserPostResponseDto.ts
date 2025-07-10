// backend/application/user/activity/posts/dtos/UserPostResponseDto.ts

/**
 * 사용자 게시글 조회 결과로 반환되는 개별 게시글 데이터의 DTO입니다.
 */
export interface UserPostResponseDto {
  id: number
  title: string
  hits: number
  category: string // 카테고리 이름 (예: "자유게시판")
  createdAt: string // ISO 8601 문자열
}

/**
 * 사용자 게시글 목록 조회 결과로 반환되는 전체 응답 DTO입니다.
 */
export interface GetUserPostsResponseDto {
  data: UserPostResponseDto[]
  total: number // 총 게시글 개수
}
