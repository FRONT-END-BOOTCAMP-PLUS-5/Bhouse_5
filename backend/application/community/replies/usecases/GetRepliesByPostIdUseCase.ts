import ReplyRepository from '@be/domain/repositories/ReplyRepository'
import { ReplyDto } from '../dtos/ReplyDto'

export class GetRepliesByPostIdUseCase {
  constructor(private readonly repo: ReplyRepository) {}

  async execute(postId: number): Promise<ReplyDto[]> {
    const replies = await this.repo.getRepliesByPostId(postId)

    return replies.map((reply) => ({
      replyId: reply.replyId,
      postId: reply.postId,
      userId: reply.userId,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      parentReplyId: reply.parentReplyId,
      users: {
        nickname: reply.users.nickname,
        profileImgUrl: reply.users.profileImgUrl,
      },
    }))
  }
}
