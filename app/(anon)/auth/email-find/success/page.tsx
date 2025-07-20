'use client'

import Button from '@/_components/Button/Button'
import styles from './success.module.css'
import CheckIcon from '@public/icons/check.svg'

export default function EmailFindSuccessPage() {
  const email = localStorage.getItem('foundEmail')

  return (
    <div className={styles.container}>
      <CheckIcon width={80} height={80} className={styles.checkIcon} />
      <p>
        회원님의 이메일 주소는
        <br />
        {email}입니다
      </p>
      <p className={styles.helpText}>전체 주소를 잊어버리셨다면 관리자에게 문의해주세요.</p>
      <Button href="/auth/signin" onClick={() => localStorage.removeItem('foundEmail')}>
        로그인하러 가기
      </Button>
    </div>
  )
}
