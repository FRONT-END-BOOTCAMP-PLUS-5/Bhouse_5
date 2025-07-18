'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  borderRadius?: '8' | '12' | '16' | '20' | '60' // 둥글기 variant
  variant?: 'primary' | 'secondary' | 'ghost' | 'gray' // 버튼 스타일 variant (예시)
  size?: 'small' | 'medium' | 'large' // 버튼 크기 (예시)
  fontStyle?: 'light' | 'bold' // 폰트 스타일
  className?: string // 추가적인 커스텀 스타일을 위한 클래스
  href?: string // 링크 주소 (있으면 링크로 렌더링)
}

const Button: React.FC<ButtonProps> = ({
  children,
  borderRadius = '8', // 기본값 설정
  variant = 'primary', // 기본값 설정
  size = 'medium', // 기본값 설정
  fontStyle = 'bold', // 기본값 설정
  className,
  href,
  ...props
}) => {
  const buttonClassName = `${styles.button} ${styles[`borderRadius${borderRadius}`]} ${styles[variant]} ${styles[size]} ${styles[fontStyle]} ${className || ''}`

  // href가 없으면 일반 button으로 렌더링
  return (
    <>
      {href ? (
        <Link href={href} className={buttonClassName}>
          {children}
        </Link>
      ) : (
        <button className={buttonClassName} {...props}>
          {children}
        </button>
      )}
    </>
  )
}

export default Button
