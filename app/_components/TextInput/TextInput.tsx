// TextInput.tsx
'use client'

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './TextInput.module.css'
import Button from '../Button/Button' // Button 컴포넌트 임포트

// Input과 Textarea 모두를 위한 공통 props
type CommonInputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' // 'textarea' 추가
  placeholder?: string
  className?: string // 외부에서 추가 스타일을 위한 클래스
  /**
   * TextInput의 크기를 정의합니다. 'small', 'medium' 또는 기본 크기 (undefined)를 가집니다.
   */
  size?: 'small' // size prop 추가
  // Button 관련 props 추가
  hasButton?: boolean // 버튼을 렌더링할지 여부
  buttonLabel?: string // 버튼 텍스트
  onButtonClick?: () => void // 버튼 클릭 핸들러
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> // 기본 HTML 속성 상속

const TextInput: React.FC<CommonInputProps> = ({
  type = 'text',
  className,
  size, // size prop을 props에서 분리
  hasButton = false, // 기본값 false
  buttonLabel,
  onButtonClick,
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

  // TextInput 내부에 버튼이 있는 경우를 위한 컨테이너 렌더링
  if (hasButton) {
    return (
      <div
        className={`${styles.inputContainerWithButton} ${size === 'small' ? styles.inputContainerWithButtonSmall : ''}`}
      >
        <input
          type={type}
          className={`${inputClasses} ${styles.inputWithButton}`} // 버튼이 있을 때 input을 위한 추가 스타일 클래스
          {...(props as InputHTMLAttributes<HTMLInputElement>)} // input props 타입 캐스팅
        />
        {buttonLabel && ( // buttonLabel이 있을 때만 버튼 렌더링
          <Button
            variant="primary" // 버튼의 variant는 'primary'로 고정
            size={size} // TextInput의 size에 따라 버튼 size도 변경
            borderRadius="8" // 피그마 이미지에 맞춰 borderRadius 고정 (8px)
            onClick={onButtonClick}
            className={styles.innerButton} // 내부 버튼을 위한 스타일 클래스
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    )
  }

  // 버튼이 없는 일반 TextInput
  return (
    <input
      type={type}
      className={inputClasses}
      {...(props as InputHTMLAttributes<HTMLInputElement>)} // input props 타입 캐스팅
    />
  )
}

export default TextInput
