export class Post {
  constructor(
    public postId: number,
    public userId: string,
    public title: string,
    public content: string,
    public createdAt: Date,
    public updatedAt?: Date,
    public categoryId?: number,
    public town?: string,
    public hits?: number,
    public nickname?: string,
    public profileImgUrl?: string | null,
  ) {}
}
