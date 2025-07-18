'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) return

    const handleGoogleLogin = async () => {
      try {
        const res = await fetch('/api/auth/sso/google', {
          method: 'POST',
          body: JSON.stringify({ code }),
        })

        const data = await res.json()

        if (data.status !== 200) {
          alert(data.message || '로그인 실패')
          router.push('/')
          return
        }

        if (data.isNewUser) {
          router.push('/signup?provider=google')
        } else {
          router.push('/')
        }
      } catch (err) {
        alert('로그인 중 오류 발생')
        router.push('/')
      }
    }

    handleGoogleLogin()
  }, [code, router])

  return <p>구글 로그인 처리 중...</p>
}
