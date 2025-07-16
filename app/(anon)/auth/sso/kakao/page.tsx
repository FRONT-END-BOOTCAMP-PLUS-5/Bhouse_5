'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SocialLoginIcons from '@/_components/SSO/SsoButton'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const hasAuthToken = document.cookie.split('; ').find((row) => row.startsWith('accessToken=')) // ← 쿠키 이름에 맞게 수정

    if (hasAuthToken) {
      router.push('/')
    }
  }, [router])

  return (
    <div>
      <SocialLoginIcons />
    </div>
  )
}
