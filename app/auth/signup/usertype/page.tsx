'use client'
import Link from 'next/link'
import Image from 'next/image'
import styles from './usertype.module.css'

export default function UserTypePage() {
  return (
    <div className={styles.container}>
      <Link className={styles.link} href="/auth/signup">
        사장님으로 가입하기
      </Link>
      <Link className={styles.link} href="/auth/signup">
        <Image src="/user.svg" alt="User icon" width={24} height={24} />
        회원으로 가입하기
      </Link>
    </div>
  )
}
