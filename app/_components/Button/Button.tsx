'use client'

import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  borderRadius?: '8' | '12' | '16' | '20' | '60' // 둥글기 variant
  variant?: 'primary' | 'secondary' | 'ghost' // 버튼 스타일 variant (예시)
  size?: 'small' | 'medium' | 'large' // 버튼 크기 (예시)
  className?: string // 추가적인 커스텀 스타일을 위한 클래스
}

const Button: React.FC<ButtonProps> = ({
  children,
  borderRadius = '8', // 기본값 설정
  variant = 'primary', // 기본값 설정
  size = 'medium', // 기본값 설정
  className,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[`borderRadius${borderRadius}`]} ${styles[variant]} ${styles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
