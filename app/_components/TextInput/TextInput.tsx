// TextInput.tsx
'use client'

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './TextInput.module.css'
import Button from '../Button/Button' // Button 컴포넌트 임포트

// Input과 Textarea 모두를 위한 공통 props
// (채영) 라벨타입 추가함. 라벨이 있으면 label과 input을 함께 렌더링. 예시) 회원가입폼에서 사용
type CommonInputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'label' // 'label' 추가
  placeholder?: string
  className?: string // 외부에서 추가 스타일을 위한 클래스
  /**
   * TextInput의 크기를 정의합니다. 'small', 'medium' 또는 기본 크기 (undefined)를 가집니다.
   */
  size?: 'small' // size prop 추가
  label?: string // label 텍스트를 위한 prop 추가
  // Add more common props like value, onChange, etc. if needed
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> // 기본 HTML 속성 상속

const TextInput: React.FC<CommonInputProps> = ({
  type = 'text',
  className,
  size, // size prop을 props에서 분리
  label, // label prop 추가
  ...props
}) => {
  // inputBase 클래스, size에 따른 클래스 조합 (label이 있을 때는 className 제외)
  const inputClasses = [
    styles.inputBase,
    size === 'small' ? styles.small : '', // small prop이 있을 때 small 클래스 추가
    // label이 있을 때는 className을 input에 적용하지 않음
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

  // label이 있으면 label과 input을 함께 렌더링
  if (label) {
    return (
      <div className={`${styles.inputContainer} ${className || ''}`}>
        <label className={styles.label}>{label}</label>
        <input
          type={type}
          className={inputClasses}
          {...(props as InputHTMLAttributes<HTMLInputElement>)} // input props 타입 캐스팅
        />
      </div>
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
