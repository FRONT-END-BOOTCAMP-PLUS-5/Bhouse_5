import { Reply } from '../entities/Reply'

export default interface ReplyRepository {
  createReply(postId: number, userId: string, content: string, parentReplyId?: number): Promise<Reply>
}
