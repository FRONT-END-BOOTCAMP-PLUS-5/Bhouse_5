'use client'

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './TextInput.module.css'

// Input과 Textarea 모두를 위한 공통 props
type CommonInputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' // 'textarea' 추가
  placeholder?: string
  className?: string // 외부에서 추가 스타일을 위한 클래스
  // Add more common props like value, onChange, etc. if needed
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> // 기본 HTML 속성 상속

const TextInput: React.FC<CommonInputProps> = ({ type = 'text', className, ...props }) => {
  const inputClasses = `${styles.inputBase} ${className || ''}`

  if (type === 'textarea') {
    return (
      <textarea
        className={`${inputClasses} ${styles.textarea}`}
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} // textarea props 타입 캐스팅
      />
    )
  }

  return (
    <input
      type={type}
      className={inputClasses}
      {...(props as InputHTMLAttributes<HTMLInputElement>)} // input props 타입 캐스팅
    />
  )
}

export default TextInput
