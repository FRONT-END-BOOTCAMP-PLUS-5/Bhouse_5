'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupSchemaType } from 'models/schemas/auth.schema'
import { useForm } from 'react-hook-form'
import TextInput from '@/_components/TextInput/TextInput'
import Button from '@/_components/Button/Button'
import styles from './form.module.css'
import ErrorMessage from './_components/ErrorMessage'
import { EmailDuplicateService, SignupService } from 'models/services/auth.service'

export default function SignupFormPage() {
  const {
    watch,
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'all',
  })

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      const signupData = {
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        roleId: 2, // 기본값: 일반 사용자
        provider: 'local', // 로컬 회원가입
        provider_id: null, // 로컬 회원가입이므로 null
      }

      const response = await SignupService(signupData)
      console.log('회원가입 성공:', response)
    } catch (error) {
      console.error('회원가입 실패:', error)
    }
  }

  const handleEmailDuplicate = async () => {
    try {
      const response = await EmailDuplicateService(watch('email'))
      console.log('이메일 중복확인 성공:', response)
    } catch (error) {
      console.error('이메일 중복확인 실패:', error)
      setError('email', { message: error as string })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextInput type="label" {...register('email')} label="이메일" placeholder="이메일을 입력하세요" />
      {errors.email && <ErrorMessage message={errors.email.message!} />}
      <Button type="button" variant="primary" onClick={handleEmailDuplicate}>
        중복확인
      </Button>
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
      <Button variant={isValid ? 'primary' : 'gray'} type="submit" className={styles.marginTop}>
        다음
      </Button>
    </form>
  )
}
