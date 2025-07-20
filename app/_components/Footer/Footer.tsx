// src/components/common/Footer/Footer.tsx
'use client' // 클라이언트 컴포넌트로 지정

import React from 'react'
import Link from 'next/link' // Link 컴포넌트 임포트
import styles from './Footer.module.css' // Footer 전용 CSS 모듈

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Link 컴포넌트를 사용하여 /support 페이지로 이동 */}
        <Link href="/support" className={`${styles.footerLink} ${styles.body16} ${styles.whiteText}`}>
          고객지원
        </Link>
      </div>
    </footer>
  )
}

export default Footer
