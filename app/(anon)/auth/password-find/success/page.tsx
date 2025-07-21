'use client'

import { useForm } from 'react-hook-form'
import styles from './success.module.css'
import { passwordUpdateSchema, PasswordUpdateSchemaType } from 'models/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/_components/TextInput/TextInput'
import Button from '@/_components/Button/Button'
import { ErrorMessage } from '@/_components/Message/Message'
import { passwordResetService } from 'models/services/auth.service'
import { useUserStore } from '@store/user.store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PasswordFindSuccessPage() {
  const router = useRouter()

  const { userId } = useUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordUpdateSchemaType>({
    resolver: zodResolver(passwordUpdateSchema),
  })

  if (!userId)
    return (
      <Link href="/auth/password-find" className={styles.link}>
        만료된 링크입니다. <br />
        다시 비밀번호 찾기를 진행해주세요.
      </Link>
    )

  const onSubmit = async (data: PasswordUpdateSchemaType) => {
    try {
      const response = await passwordResetService({ userId: userId, newPassword: data.newPassword })
      console.log(response)
      alert('비밀번호가 변경되었습니다. 로그인 후 이용해주세요.')
      router.push('/auth/signin')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1 className={styles.title}>비밀번호 변경</h1>
      <TextInput type="label" {...register('newPassword')} label="비밀번호" placeholder="비밀번호를 입력해주세요." />
      {errors.newPassword && <ErrorMessage message={errors.newPassword.message!} />}
      <TextInput
        type="label"
        {...register('passwordConfirm')}
        label="비밀번호 확인"
        placeholder="비밀번호를 입력해주세요."
      />
      {errors.passwordConfirm && <ErrorMessage message={errors.passwordConfirm.message!} />}
      <Button type="submit" variant={isValid ? 'primary' : 'gray'}>
        비밀번호 찾기
      </Button>
    </form>
  )
}
