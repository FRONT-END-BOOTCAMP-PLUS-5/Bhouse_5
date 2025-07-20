'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupSchemaType } from 'models/schemas/auth.schema'
import { useForm } from 'react-hook-form'
import TextInput from '@/_components/TextInput/TextInput'
import Button from '@/_components/Button/Button'
import styles from './form.module.css'
import ErrorMessage from './_components/ErrorMessage'
import { EmailDuplicateService, SignupService } from 'models/services/auth.service'

export default function SignupFormPage() {
  const searchParams = useSearchParams()
  const roleId = parseInt(searchParams.get('role') || '2') // 기본값은 2 (일반 사용자)
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  const {
    watch,
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'all',
    defaultValues: {
      roleId: roleId,
    },
  })

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      const signupData = {
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        roleId: roleId, // 쿼리 파라미터에서 받은 role 사용
        provider: 'local', // 로컬 회원가입
        provider_id: null, // 로컬 회원가입이므로 null
      }

      const response = await SignupService(signupData)
      console.log('회원가입 성공:', response)
    } catch (error: any) {
      console.error('회원가입 실패:', error)

      // response.data.error에서 폰 번호 중복 에러 처리
      if (error.response?.data?.error && error.response.data.error.includes('휴대폰')) {
        setError('phone', { message: '이미 등록된 휴대폰 번호입니다.' })
      } else {
        // 일반적인 에러 메시지
        console.error('알 수 없는 에러:', error.response?.data?.error || error.message)
      }
    }
  }

  const handleEmailDuplicate = async () => {
    try {
      const response = await EmailDuplicateService(watch('email'))
      console.log('이메일 중복확인 성공:', response)
      setIsEmailVerified(true)
    } catch (error) {
      console.error('이메일 중복확인 실패:', error)
      setError('email', { message: error as string })
      setIsEmailVerified(false)
    }
  }

  // 이메일이 변경될 때 중복확인 상태 초기화
  const currentEmail = watch('email')
  React.useEffect(() => {
    setIsEmailVerified(false)
  }, [currentEmail])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextInput type="label" {...register('email')} label="이메일" placeholder="이메일을 입력하세요" />
      {errors.email && <ErrorMessage message={errors.email.message!} />}
      <Button type="button" variant="primary" onClick={handleEmailDuplicate} disabled={isEmailVerified}>
        {isEmailVerified ? '확인완료' : '중복확인'}
      </Button>
      {!isEmailVerified && currentEmail && !errors.email && <ErrorMessage message="이메일 중복확인을 해주세요." />}
      <TextInput
        type="label"
        {...register('password')}
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        className={styles.marginTop}
      />
      {errors.password && <ErrorMessage message={errors.password.message!} />}
      <TextInput
        type="label"
        {...register('passwordConfirm')}
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력하세요"
      />
      {errors.passwordConfirm && <ErrorMessage message={errors.passwordConfirm.message!} />}
      <TextInput
        type="label"
        {...register('username')}
        label="성함"
        placeholder="성함을 입력하세요"
        className={styles.marginTop}
      />
      {errors.username && <ErrorMessage message={errors.username.message!} />}
      <TextInput type="label" {...register('phone')} label="휴대폰" placeholder="휴대폰을 입력하세요" />
      {errors.phone && <ErrorMessage message={errors.phone.message!} />}

      {roleId === 3 && (
        //TODO: 사업자 등록번호 검사 api연동 필요
        <>
          <TextInput
            type="label"
            {...register('businessNumber')}
            label="사업자등록번호"
            placeholder="사업자등록번호를 입력하세요"
          />
          {errors.businessNumber && <ErrorMessage message={errors.businessNumber.message!} />}
        </>
      )}

      <Button variant={isValid && isEmailVerified ? 'primary' : 'gray'} type="submit" className={styles.marginTop}>
        다음
      </Button>
    </form>
  )
}
