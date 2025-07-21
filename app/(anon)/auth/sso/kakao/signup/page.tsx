'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SignupForm() {
  const params = useSearchParams()
  const provider = params.get('provider')

  return (
    <div>
      <h1>{provider === 'kakao' ? '카카오로 SSO 회원가입' : '회원가입'}</h1>
      {/* 일반 or SSO 폼 표시 */}
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
}
