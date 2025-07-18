'use client'

import React from 'react'
import styles from './Toggle.module.css'

interface ToggleProps {
  /** 토글의 현재 상태 (켜짐/꺼짐) */
  checked: boolean
  /** 토글 상태 변경 시 호출될 함수 */
  onChange: (checked: boolean) => void
  /** 토글의 크기 (기본값: 'medium') */
  size?: 'small' | 'medium' | 'large'
  /** 추가적인 커스텀 스타일을 위한 클래스 */
  className?: string
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, size = 'medium', className }) => {
  const handleClick = () => {
    onChange(!checked)
  }

  return (
    <div
      className={`${styles.toggleContainer} ${checked ? styles.checked : ''} ${styles[size]} ${className || ''}`}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
      tabIndex={0} // Makes it focusable
      onKeyDown={(e) => {
        // Keyboard accessibility
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange(!checked)
        }
      }}
    >
      <span className={styles.toggleThumb}></span>
    </div>
  )
}

export default Toggle
