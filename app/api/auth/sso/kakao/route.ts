import { NextRequest, NextResponse } from 'next/server'
import { KakaoOAuthService } from '@be/utils/oauth/KakaoOAuthService'
import { LoginSSOAuthUsecase } from '@be/application/auth/signin/usecases/SigninSSOAuthUsecase'
import { CreateSSOAuthUsecase } from '@be/application/auth/signup/usecases/CreateSSOAuthUsecase'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    const kakaoService = new KakaoOAuthService(process.env.KAKAO_CLIENT_ID!, process.env.KAKAO_REDIRECT_URI!)

    const accessToken = await kakaoService.getAccessToken(code)
    const kakaoUser = await kakaoService.getUserInfo(accessToken)

    const authRepo = new AuthRepositoryImpl()
    const loginUsecase = new LoginSSOAuthUsecase(authRepo)

    // 먼저 로그인 시도
    const loginResult = await loginUsecase.execute({
      provider: 'kakao',
      providerId: kakaoUser.id,
    })

    let finalResult
    let isNewUser = false

    // 사용자가 존재하지 않으면 회원가입 처리
    if (loginResult.status === 404) {
      const signupUsecase = new CreateSSOAuthUsecase(authRepo)
      finalResult = await signupUsecase.execute({
        email: kakaoUser.kakao_account.email || '',
        username: kakaoUser.kakao_account.email || `kakao_${kakaoUser.id}`,
        provider: 'kakao',
        providerId: kakaoUser.id,
        nickname: kakaoUser.kakao_account.profile?.nickname,
      })
      isNewUser = true
    } else {
      finalResult = loginResult
    }

    // 에러가 있으면 에러 응답 반환
    if (finalResult.error) {
      return NextResponse.json(finalResult, { status: finalResult.status })
    }

    // 성공 응답
    const res = NextResponse.json({
      message: finalResult.message,
      status: finalResult.status,
      isNewUser,
      accessToken: finalResult.accessToken,
      refreshToken: finalResult.refreshToken,
    })

    // 토큰이 있으면 쿠키에 설정
    if (finalResult.accessToken) {
      res.cookies.set('accessToken', finalResult.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60, // 1시간
      })
    }

    if (finalResult.refreshToken) {
      res.cookies.set('refreshToken', finalResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 2 * 24 * 60 * 60, // 2일
      })
    }

    return res
  } catch (error) {
    console.error('Kakao SSO error:', error)
    return NextResponse.json(
      {
        message: '카카오 로그인 처리 중 오류가 발생했습니다.',
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 },
    )
  }
}
