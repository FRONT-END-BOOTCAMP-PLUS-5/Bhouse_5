'use client'

import { signoutService } from 'models/services/auth.service'
import styles from './My.module.css'
import { useAuthStore } from 'store/auth.store'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { ErrorMessage } from '@/_components/Message/Message'
import LocalErrorMessage from './_components/ErrorMessage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/_components/TextInput/TextInput'
import Button from '@/_components/Button/Button'
import Image from 'next/image'
import { profileSchema, ProfileSchemaType } from 'models/schemas/user.schema'
import { updateProfileService } from 'models/services/profile.service'

function My() {
  const { setLogout, user } = useAuthStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const profileImageUrl = user?.profile_img_url || '/images/user_empty_profile_img.png'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    mode: 'all',
  })

  const handleSignout = async () => {
    try {
      await signoutService()
      setLogout()
      alert('로그아웃 성공')
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      await updateProfileService({
        nickname: data.nickname,
        profileImgUrl: data.profileImgUrl || '',
      })
      alert('프로필 업데이트 성공')
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
    }
  }

  return (
    <div className={styles.container}>
      {searchParams.get('alert') === 'profile_required' && (
        <ErrorMessage message="닉네임과 타운 정보를 등록해야 서비스를 이용할 수 있습니다." />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.profileImageSection}>
          <div className={styles.profileImage}>
            <Image src={profileImageUrl} alt="프로필 이미지" width={120} height={120} />
            <button type="button" className={styles.imageUploadBtn}>
              +
            </button>
          </div>
        </div>

        <TextInput type="label" {...register('nickname')} label="닉네임" defaultValue={user?.nickname || ''} />
        {errors.nickname && <LocalErrorMessage message={errors.nickname.message!} />}

        <Button type="button" variant="primary" href="/user/towns/register">
          내 동네 등록하기
        </Button>

        <div className={styles.buttonGroup}>
          <Button type="button" variant="primary" onClick={handleSignout} className={styles.signoutButton}>
            로그아웃
          </Button>
          <Button type="submit" variant={isValid ? 'primary' : 'gray'} className={styles.completeButton}>
            변경저장
          </Button>
        </div>
      </form>
    </div>
  )
}

export default My
