'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function KakaoCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const isProcessing = useRef(false) // 중복 방지 플래그

  useEffect(() => {
    if (!code || isProcessing.current) return

    isProcessing.current = true

    const handleKakaoLogin = async () => {
      try {
        const res = await fetch('/api/auth/sso/kakao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        const data = await res.json()

        if (data.status !== 200) {
          alert(data.message || '카카오 로그인 실패')
          router.push('/')
          return
        }

        if (data.isNewUser) {
          router.push('/signup?provider=kakao')
        } else {
          router.push('/')
        }
      } catch (err) {
        console.error('카카오 로그인 처리 중 오류:', err)
        alert('카카오 로그인 중 문제가 발생했습니다.')
        router.push('/')
      }
    }

    handleKakaoLogin()
  }, [code]) // ✅ router 제외!

  return <p>카카오 로그인 처리 중...</p>
}
