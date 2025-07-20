// domain/entities/Reply.ts

export class Reply {
  constructor(
    public replyId: number,
    public postId: number,
    public userId: string,
    public content: string,
    public createdAt: Date,
    public parentReplyId: number | null,
    public users: {
      nickname: string
      profileImgUrl: string | null
    },
  ) {}
}
