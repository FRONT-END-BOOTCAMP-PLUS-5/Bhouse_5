'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupSchemaType } from 'models/schemas/auth.schema'
import { useForm } from 'react-hook-form'
import TextInput from '@/_components/TextInput/TextInput'
import Button from '@/_components/Button/Button'
import styles from './form.module.css'

export default function SignupFormPage() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'all',
  })

  const onSubmit = (data: SignupSchemaType) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextInput type="label" {...register('email')} label="이메일" placeholder="이메일을 입력하세요" />
      <Button variant="primary" className={styles.marginBottom}>
        중복확인
      </Button>
      <TextInput type="label" {...register('password')} label="비밀번호" placeholder="비밀번호를 입력하세요" />
      <TextInput
        type="label"
        {...register('passwordConfirm')}
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력하세요"
        className={styles.marginBottom}
      />
      <TextInput type="label" {...register('name')} label="성함" placeholder="성함을 입력하세요" />
      <TextInput
        type="label"
        {...register('nickname')}
        label="휴대폰"
        placeholder="휴대폰을 입력하세요"
        className={styles.marginBottom}
      />
      <Button variant={isValid ? 'primary' : 'gray'} type="submit">
        다음
      </Button>
    </form>
  )
}
