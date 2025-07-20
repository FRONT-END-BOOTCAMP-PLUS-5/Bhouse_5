import ReplyRepository from '@be/domain/repositories/ReplyRepository'

export class DeleteReplyUseCase {
  constructor(private readonly repo: ReplyRepository) {}

  async execute(replyId: number, userId: string): Promise<void> {
    await this.repo.deleteReply(replyId, userId)
  }
}
