// backend/application/community/posts/dtos/PostListDto.ts
export interface PostListDto {
  postId: number
  userId: string
  title: string
  createdAt: string
  town?: string | null
  hits?: number
  nickname?: string | null
  profileImgUrl?: string | null
}
