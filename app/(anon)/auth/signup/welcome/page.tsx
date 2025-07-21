'use client'

import Link from 'next/link'
import styles from './welcome.module.css'

export default function WelcomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className={styles.title}>🎉 회원가입이 완료되었습니다!</h1>
        <p className={styles.subtitle}>
          보드게임 하우스에 오신 것을 환영합니다.
          <br />
          이제 로그인하고 다양한 보드게임을 즐겨보세요!
        </p>

        <div className={styles.buttonContainer}>
          <Link href="/auth/signin" className={styles.loginButton}>
            로그인하고 시작하기
          </Link>
        </div>

        <div className={styles.footer}>
          <p>궁금한 점이 있으시면 언제든 문의해주세요!</p>
        </div>
      </div>
    </div>
  )
}
