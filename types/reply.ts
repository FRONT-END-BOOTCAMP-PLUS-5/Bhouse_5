export interface Reply {
  replyId: number
  postId: number
  userId: string
  content: string
  createdAt: string
  parentReplyId: number | null
  users: {
    nickname: string
    profileImgUrl: string | null
  }
}
