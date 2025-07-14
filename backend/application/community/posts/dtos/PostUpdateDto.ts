export interface PostUpdateDto {
  postId: number
  userId: string
  title: string
  content: string
  categoryId?: number
  town?: string
}
