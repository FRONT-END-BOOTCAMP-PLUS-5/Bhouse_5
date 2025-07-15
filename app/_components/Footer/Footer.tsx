// src/components/common/Footer/Footer.tsx
'use client' // 클라이언트 컴포넌트로 지정

import React from 'react'
import styles from './Footer.module.css' // Footer 전용 CSS 모듈

const Footer: React.FC = () => {
  const handleCustomerSupportClick = () => {
    console.log('고객지원 클릭')
    // TODO: 고객지원 페이지로 이동 로직 추가
  }

  const handleContactUsClick = () => {
    console.log('문의하기 클릭')
    // TODO: 문의하기 페이지로 이동 로직 추가
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <a
          href="#"
          onClick={handleCustomerSupportClick}
          className={`${styles.footerLink} ${styles.body16} ${styles.whiteText}`}
        >
          고객지원
        </a>
        <a
          href="#"
          onClick={handleContactUsClick}
          className={`${styles.footerLink} ${styles.body16} ${styles.whiteText}`}
        >
          문의하기
        </a>
      </div>
    </footer>
  )
}

export default Footer
