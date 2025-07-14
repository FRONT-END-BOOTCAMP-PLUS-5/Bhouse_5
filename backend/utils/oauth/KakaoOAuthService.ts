import axios from "axios";

export interface KakaoUserInfo {
  id: string;
  kakao_account: {
    email?: string;
    profile?: {
      nickname?: string;
    };
  };
}

export class KakaoOAuthService {
  private clientId = process.env.KAKAO_CLIENT_ID!;
  private redirectUri = process.env.KAKAO_REDIRECT_URI!;

  async getAccessToken(code: string): Promise<string> {
    const res = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data.access_token;
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    const res = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    return res.data;
  }
}
