'use client'

import { signoutService } from 'models/services/auth.service'
import styles from './My.module.css'
import { useAuthStore } from 'store/auth.store'

function My() {
  const { isLogin, setLogout } = useAuthStore()

  const handleSignout = async () => {
    try {
      await signoutService()
      setLogout()
      alert('로그아웃 성공')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      내 프로필 보기
      {isLogin ? (
        <>
          <button onClick={handleSignout}>로그아웃</button>
        </>
      ) : (
        '로그인 안됨'
      )}
    </div>
  )
}

export default My
