'use client'

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './TextInput.module.css'

// Input과 Textarea 모두를 위한 공통 props
type CommonInputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' // 'textarea' 추가
  placeholder?: string
  className?: string // 외부에서 추가 스타일을 위한 클래스
  /**
   * TextInput의 크기를 정의합니다. 'small', 'medium' 또는 기본 크기 (undefined)를 가집니다.
   */
  size?: 'small' | 'medium' // size prop 추가
  // Add more common props like value, onChange, etc. if needed
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> // 기본 HTML 속성 상속

const TextInput: React.FC<CommonInputProps> = ({
  type = 'text',
  className,
  size, // size prop을 props에서 분리
  ...props
}) => {
  // inputBase 클래스, size에 따른 클래스, 외부 className을 조합
  const inputClasses = [
    styles.inputBase,
    size === 'small' ? styles.small : '',
    size === 'medium' ? styles.medium : '', // medium prop이 있을 때 medium 클래스 추가
    className, // 외부에서 전달된 className
  ]
    .filter(Boolean)
    .join(' ') // 빈 문자열 제거 후 공백으로 join

  if (type === 'textarea') {
    return (
      <textarea
        className={`${inputClasses} ${styles.textarea}`} // textarea 고유 스타일도 추가
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
