export interface LoginSSOAuthDto {
  provider: string;       // 'google', 'kakao'
  providerId: string;     // 고유 식별자 (sub 등)
}