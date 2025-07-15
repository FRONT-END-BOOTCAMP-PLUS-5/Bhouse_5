'use client'
import Link from 'next/link'
import styles from './usertype.module.css'
import BellIcon from '@public/bell.svg'

export default function UserTypePage() {
  return (
    <div className={styles.container}>
      <Link className={styles.link} href="/auth/signup">
        사장님으로 가입하기
      </Link>
      <Link className={styles.link} href="/auth/signup">
        <BellIcon width={12} height={12} />
        회원으로 가입하기
      </Link>
    </div>
  )
}
