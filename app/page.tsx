'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Link href="/auth/signin">Home</Link>
      <div>Bhouse_5</div>
    </div>
  )
}
