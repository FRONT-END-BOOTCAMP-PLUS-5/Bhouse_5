'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/_components/TextInput/TextInput'
import { signinService } from 'models/services/auth.service'
import { getProfileService } from 'models/services/profile.service'
import { useAuthStore } from 'store/auth.store'
import { loginSchema, LoginSchemaType } from 'models/schemas/auth.schema'
import styles from './signin.module.css'
import globalStyles from '@/page.module.css'
import Button from '@/_components/Button/Button'
import { ErrorMessage } from '@/_components/Message/Message'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SigninPage() {
  const router = useRouter()

  const { setLogin } = useAuthStore()

  const [serverError, setServerError] = useState<string>('')

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
  })

  const handleSubmit = async (data: LoginSchemaType) => {
    setServerError('') // 에러 초기화

    try {
      await signinService({ username: data.email, password: data.password })
      const res = await getProfileService()
      setLogin(res)
      router.push('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
      setServerError(errorMessage)
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* 폼 에러 메시지 */}
        {form.formState.errors.email && <ErrorMessage message={form.formState.errors.email.message!} />}
        {form.formState.errors.password && <ErrorMessage message={form.formState.errors.password.message!} />}

        {/* 서버 에러 메시지 */}
        {serverError && <ErrorMessage message={serverError} />}

        <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
          <TextInput type="email" placeholder="이메일" {...form.register('email')} />
          <TextInput type="password" placeholder="비밀번호" {...form.register('password')} />
          <Button type="submit">로그인</Button>
        </form>

        <nav className={styles.LinkContainer}>
          <Link href="/auth/email-find" className={`${styles.forgotLink} ${globalStyles.body12}`}>
            Forgot Id?
          </Link>
          <Link href="/auth/password-find" className={`${styles.forgotLink} ${globalStyles.body12}`}>
            Forgot Password?
          </Link>
          <Link href="/auth/signup" className={`${styles.signupLink} ${globalStyles.body12}`}>
            Sign up
          </Link>
        </nav>
      </div>
    </div>
  )
}
