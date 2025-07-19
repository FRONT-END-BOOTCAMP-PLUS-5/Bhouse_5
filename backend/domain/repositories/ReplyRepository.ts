import { Reply } from '../entities/Reply'

export default interface ReplyRepository {
  // ✅ Create
  createReply(postId: number, userId: string, content: string, parentReplyId?: number): Promise<Reply>

  // ✅ Read
  getRepliesByPostId(postId: number): Promise<Reply[]>
  getReplyById(replyId: number): Promise<Reply | null>

  // ✅ Update
  updateReply(replyId: number, userId: string, content: string): Promise<Reply>

  // ✅ Delete
  deleteReply(replyId: number, userId: string): Promise<void>
}
