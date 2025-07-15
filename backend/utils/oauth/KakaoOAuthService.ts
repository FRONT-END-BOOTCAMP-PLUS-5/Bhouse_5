import axios from 'axios'

export interface KakaoTokenResponse {
  access_token: string
  token_type: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}

export interface KakaoUserInfo {
  id: string
  kakao_account: {
    email?: string
    profile?: {
      nickname?: string
    }
  }
}

export class KakaoOAuthService {
  constructor(
    private readonly clientId: string,
    private readonly redirectUri: string,
  ) {}

  async getAccessToken(code: string): Promise<string> {
    try {
      console.log(
        '🧪 Kakao token request payload:',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code,
        }).toString(),
      )
      const res = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      return (res.data as KakaoTokenResponse).access_token
    } catch (err: any) {
      console.error('카카오 access token 요청 실패:', err.response?.data)
      throw new Error('Kakao access token 발급 실패')
    }
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      const res = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })

      return res.data as KakaoUserInfo
    } catch (err) {
      console.error('카카오 사용자 정보 조회 실패', err)
      throw new Error('Kakao 사용자 정보 조회 실패')
    }
  }
}
