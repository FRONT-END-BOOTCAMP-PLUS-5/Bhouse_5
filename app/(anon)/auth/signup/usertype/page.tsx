'use client'
import Link from 'next/link'
import styles from './usertype.module.css'
import globalStyles from '@/page.module.css'
import ShopIcon from '@public/icons/shop.svg'
import UserIcon from '@public/icons/user.svg'

export default function UserTypePage() {
  return (
    <div className={styles.container}>
      <Link className={`${styles.link} ${globalStyles.body16}`} href="/auth/signup?role=3">
        <ShopIcon width={48} height={48} className={styles.icon} />
        사장님으로 가입하기
      </Link>
      <Link className={`${styles.link} ${globalStyles.body16}`} href="/auth/signup?role=2">
        <UserIcon width={48} height={48} className={styles.icon} />
        회원으로 가입하기
      </Link>
    </div>
  )
}
