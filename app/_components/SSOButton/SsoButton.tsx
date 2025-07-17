'use client'

import React from 'react'
import Image from 'next/image'
import styles from './sso.module.css' // CSS로 따로 분리

const providers = [
  {
    id: 'kakao',
    icon: '/icons/kakao.svg',
    alt: '카카오 로그인',
    onClick: () => {
      window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`
    },
  },
  {
    id: 'google',
    icon: '/icons/google.svg',
    alt: '구글 로그인',
    onClick: () => {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile&access_type=offline&prompt=consent`
    },
  },
]

const SocialLoginIcons = () => {
  return (
    <div className={styles.socialLoginContainer}>
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={provider.onClick}
          className={styles.socialIconButton}
          data-provider={provider.id}
        >
          <Image src={provider.icon} alt={provider.alt} width={32} height={32} />
        </button>
      ))}
    </div>
  )
}

export default SocialLoginIcons
