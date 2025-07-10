export class Post {
  constructor(
    public post_id: number,
    public user_id: string,
    public title: string,
    public content: string,
    public created_at: Date,
    public town?: string,
    public hits?: number,
    public nickname?: string,
    public profile_img_url?: string | null
  ) {}
}
