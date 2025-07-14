'use client'

import React from 'react'
import styles from './Divider.module.css'

interface DividerProps {
  /** 구분선의 수직 마진 (위아래 간격). CSS 변수를 통해 조절됩니다. */
  marginY?: string
  /** 추가적인 CSS 클래스 */
  className?: string
}

const Divider: React.FC<DividerProps> = ({ marginY, className }) => {
  // marginY만 CSS 변수로 전달하여 유연성 유지
  const dividerStyle = marginY ? ({ '--divider-margin-y': marginY } as React.CSSProperties) : undefined

  return (
    <div
      className={`${styles.divider} ${className || ''}`}
      style={dividerStyle}
      role="separator" // 접근성 향상
    />
  )
}

export default Divider
