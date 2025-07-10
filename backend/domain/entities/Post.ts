export class Post {
  constructor(
    public post_id: number, // required
    public user_id: string, // required
    public title: string, // required
    public content: string, // required
    public created_at: Date, // required
    public town?: string, // optional
    public hits?: number, // optional
  ) {}
}