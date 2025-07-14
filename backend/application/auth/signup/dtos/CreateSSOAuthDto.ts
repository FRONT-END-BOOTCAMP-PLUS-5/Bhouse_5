export interface CreateSSOAuthDto {
  email: string;
  username: string;
  provider: string;       // eg: 'google', 'kakao'
  providerId: string;
  profileImgUrl?: string;
  nickname?: string;
}
