'use client'

import Button from '@/_components/Button/Button'
import TextInput from '@/_components/TextInput/TextInput'
import { useForm } from 'react-hook-form'
import styles from './password-find.module.css'
import { zodResolver } from '@hookform/resolvers/zod'
import { findPasswordSchema, FindPasswordSchemaType } from 'models/schemas/auth.schema'
import { findPasswordService } from 'models/services/auth.service'
import { ErrorMessage } from '@/_components/Message/Message'
import { useUserStore } from '@store/user.store'
import { useRouter } from 'next/navigation'

export default function PasswordFindPage() {
  const router = useRouter()
  const { setUserId } = useUserStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FindPasswordSchemaType>({
    resolver: zodResolver(findPasswordSchema),
  })

  const onSubmit = async (data: FindPasswordSchemaType) => {
    try {
      const response = (await findPasswordService(data)) as { userId: string }
      setUserId(response.userId)
      router.push('/auth/password-find/success')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1 className={styles.title}>비밀번호 찾기</h1>
      <TextInput type="label" {...register('username')} label="이름" placeholder="이름을 입력해주세요." />
      {errors.username && <ErrorMessage message={errors.username.message!} />}
      <TextInput type="label" {...register('email')} label="이메일" placeholder="이메일을 입력해주세요." />
      {errors.email && <ErrorMessage message={errors.email.message!} />}
      <TextInput type="label" {...register('phone')} label="전화번호" placeholder="전화번호를 입력해주세요." />
      {errors.phone && <ErrorMessage message={errors.phone.message!} />}
      <Button type="submit" variant={isValid ? 'primary' : 'gray'}>
        비밀번호 찾기
      </Button>
    </form>
  )
}
