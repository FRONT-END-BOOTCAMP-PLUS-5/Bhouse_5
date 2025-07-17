import { NextRequest, NextResponse } from 'next/server'
import { GoogleOAuthService } from '@be/utils/oauth/GoogleOAuthService'
import { AuthRepositoryImpl } from '@be/infrastructure/repositories/AuthRepositoryImpl'
import { LoginSSOAuthUsecase } from '@be/application/auth/signin/usecases/SigninSSOAuthUsecase'
import { CreateSSOAuthUsecase } from '@be/application/auth/signup/usecases/CreateSSOAuthUsecase'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    const googleService = new GoogleOAuthService(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!,
    )

    const accessToken = await googleService.getAccessToken(code)
    const googleUser = await googleService.getUserInfo(accessToken)

    const authRepo = new AuthRepositoryImpl()
    const loginUsecase = new LoginSSOAuthUsecase(authRepo)

    const loginResult = await loginUsecase.execute({
      provider: 'google',
      providerId: googleUser.sub,
    })

    let finalResult
    let isNewUser = false

    if (loginResult.status === 404) {
      const signupUsecase = new CreateSSOAuthUsecase(authRepo)
      finalResult = await signupUsecase.execute({
        email: googleUser.email,
        username: googleUser.email,
        provider: 'google',
        providerId: googleUser.sub,
        nickname: googleUser.name,
      })
      isNewUser = true
    } else {
      finalResult = loginResult
    }

    if (finalResult.error) {
      return NextResponse.json(finalResult, { status: finalResult.status })
    }

    const res = NextResponse.json({
      message: finalResult.message,
      status: finalResult.status,
      isNewUser,
      accessToken: finalResult.accessToken,
      refreshToken: finalResult.refreshToken,
    })

    res.cookies.set('accessToken', finalResult.accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })
    res.cookies.set('refreshToken', finalResult.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 2 * 24 * 60 * 60,
    })

    return res
  } catch (error) {
    console.error('Google SSO error:', error)
    return NextResponse.json(
      {
        message: '구글 로그인 처리 중 오류 발생',
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 },
    )
  }
}
