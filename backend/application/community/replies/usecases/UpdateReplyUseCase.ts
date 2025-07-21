import ReplyRepository from '@be/domain/repositories/ReplyRepository'
import { ReplyDto } from '../dtos/ReplyDto'

export class UpdateReplyUseCase {
  constructor(private readonly repo: ReplyRepository) {}

  async execute(replyId: number, userId: string, content: string): Promise<ReplyDto> {
    const reply = await this.repo.updateReply(replyId, userId, content)

    return {
      replyId: reply.replyId,
      postId: reply.postId,
      userId: reply.userId,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      parentReplyId: reply.parentReplyId,
    }
  }
}
