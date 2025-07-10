export class User {
  constructor(
    public user_id: string,
    public username: string,
    public email: string,
    public password: string,
    public nickname?: string,
    public phone?: string,
    public profile_img_url?: string,
    public provider?: string,
    public provider_id?: string,
    public created_at?: string,
    public updated_at?: string,
  ) {}
}
