import ReplyRepository from '@be/domain/repositories/ReplyRepository'
import { ReplyDto } from '../dtos/ReplyDto'

export class CreateReplyUseCase {
  constructor(private readonly repo: ReplyRepository) {}

  async execute(postId: number, userId: string, content: string, parentReplyId?: number): Promise<ReplyDto> {
    const reply = await this.repo.createReply(postId, userId, content, parentReplyId)

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
