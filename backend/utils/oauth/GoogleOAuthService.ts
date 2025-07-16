import axios from 'axios'

export interface GoogleUserInfo {
  sub: string
  email: string
  name: string
  picture: string
}

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope?: string
  refresh_token?: string
}

export class GoogleOAuthService {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string,
  ) {}

  async getAccessToken(code: string): Promise<string> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    })

    const res = await axios.post<GoogleTokenResponse>('https://oauth2.googleapis.com/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return res.data.access_token
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const res = await axios.get<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return res.data
  }
}
