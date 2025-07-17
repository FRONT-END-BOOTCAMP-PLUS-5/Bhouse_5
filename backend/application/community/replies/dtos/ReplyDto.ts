export interface ReplyDto {
  replyId: number
  postId: number
  userId: string
  content: string
  createdAt: string
  parentReplyId: number | null
}
