'use client'

import Button from '@/_components/Button/Button'
import TextInput from '@/_components/TextInput/TextInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { findEmailSchema, FindEmailSchemaType } from 'models/schemas/auth.schema'
import { useForm } from 'react-hook-form'
import styles from './email-find.module.css'
import { findEmailService } from 'models/services/auth.service'
import { ErrorMessage } from '@/_components/Message/Message'
import { useRouter } from 'next/navigation'

export default function FindEmailPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FindEmailSchemaType>({
    resolver: zodResolver(findEmailSchema),
  })

  const onSubmit = async (data: FindEmailSchemaType) => {
    try {
      const response = await findEmailService(data)
      console.log(response)

      // 마스킹된 이메일 생성
      const [localPart, domain] = response.split('@')
      const maskedEmail = localPart.substring(0, 3) + '*'.repeat(localPart.length - 3) + '@' + domain

      // 마스킹된 이메일을 로컬스토리지에 저장
      localStorage.setItem('foundEmail', maskedEmail)

      router.push('/auth/email-find/success')
    } catch (error: any) {
      console.error(111, error)
      setError('root', { message: error })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1 className={styles.title}>이메일 찾기</h1>
      {errors.root && <ErrorMessage message={errors.root.message as string} />}
      <TextInput type="label" {...register('username')} label="이름" />
      <TextInput type="label" {...register('phone')} label="휴대폰" />
      <Button type="submit">확인</Button>
    </form>
  )
}
