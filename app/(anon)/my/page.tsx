'use client'

import { signoutService } from 'models/services/auth.service'
import styles from './My.module.css'
import { useAuthStore } from 'store/auth.store'
import { useRouter, useSearchParams } from 'next/navigation'
import { ErrorMessage } from '@/_components/Message/Message'
import LocalErrorMessage from './_components/ErrorMessage'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/_components/TextInput/TextInput'
import Button from '@/_components/Button/Button'
import Image from 'next/image'
import { profileSchema, ProfileSchemaType } from 'models/schemas/user.schema'
import { useUpdateUserProfile } from 'models/querys/profile.query'

function My() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { setLogout, user } = useAuthStore()
  const { mutateAsync: updateProfile } = useUpdateUserProfile()

  // TODO: 프로필 이미지 업로드 기능 추가
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
      const updateData: any = {
        nickname: data.nickname,
        profileImgUrl: data.profileImgUrl || '',
      }
      if (data.password && data.password.trim()) {
        updateData.password = data.password
      }
      await updateProfile(updateData)
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
            {/* <button type="button" className={styles.imageUploadBtn}>
              +
            </button> */}
          </div>
        </div>

        <TextInput type="label" {...register('nickname')} label="닉네임" defaultValue={user?.nickname || ''} />
        {errors.nickname && <LocalErrorMessage message={errors.nickname.message!} />}

        <TextInput type="label" {...register('password')} label="새 비밀번호" />
        {errors.password && <LocalErrorMessage message={errors.password.message!} />}
        <TextInput type="label" {...register('passwordConfirm')} label="새 비밀번호 확인" />
        {errors.passwordConfirm && <LocalErrorMessage message={errors.passwordConfirm.message!} />}

        {user.user_role?.role_id === 2 ? (
          <Button type="button" variant="primary" href="/user/towns/register">
            내 동네 등록하기
          </Button>
        ) : (
          <Button type="button" variant="primary" href="/store-info">
            매장 목록 관리하기
          </Button>
        )}

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
