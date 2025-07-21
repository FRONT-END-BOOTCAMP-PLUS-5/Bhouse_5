// backend/application/community/posts/dtos/PostDto.ts
export interface PostDto {
  postId: number
  userId: string
  title: string
  content: string
  createdAt: string
  town: string | null
  hits: number
  nickname: string | null
  profileImgUrl: string | null
  commentCount: number
}
