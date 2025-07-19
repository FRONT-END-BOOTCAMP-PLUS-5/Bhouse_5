// application/usecases/GetReplyByIdUseCase.ts
import ReplyRepository from '@be/domain/repositories/ReplyRepository'
import { ReplyDto } from '../dtos/ReplyDto'

export class GetReplyByIdUseCase {
  constructor(private readonly repo: ReplyRepository) {}

  async execute(replyId: number): Promise<ReplyDto> {
    const reply = await this.repo.getReplyById(replyId)

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
