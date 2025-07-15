'use client'

import React from 'react'

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!

const LoginPage = () => {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`
    window.location.href = kakaoAuthUrl
  }

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile&access_type=offline&prompt=consent`
    window.location.href = googleAuthUrl
  }

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={handleKakaoLogin}>카카오로 로그인</button>
      <button onClick={handleGoogleLogin}>구글로 로그인</button>
    </div>
  )
}

export default LoginPage
