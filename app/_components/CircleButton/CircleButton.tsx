'use client'

import React from 'react'
import Image from 'next/image'
import styles from './CircleButton.module.css'

interface CircleButtonProps {
  iconSrc: string // 이미지 경로 (/icon.svg 등)
  iconAlt: string // 접근성용 대체 텍스트
  iconSize?: number // 아이콘 크기 (기본값 20)
  bgColor?: string // 버튼 배경 색상
  size?: number // 버튼 크기 (지름 px)
  onClick?: () => void
}

const CircleButton: React.FC<CircleButtonProps> = ({
  iconSrc,
  iconAlt,
  iconSize = 20,
  bgColor,
  size = 40,
  onClick,
}) => {
  return (
    <button
      className={styles.button}
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
      }}
      onClick={onClick}
      type="button"
    >
      <Image src={iconSrc} alt={iconAlt} width={iconSize} height={iconSize} />
    </button>
  )
}

export default CircleButton

//<CircleButton
//   icon={<img src="/icons/trash.svg" width={20} height={20} alt="삭제" />}
//   bgColor="#bbdefb"
//   size={40}
//   onClick={() => console.log('삭제 클릭')}
// />

{
  /* <CircleButton icon="🗑️" bgColor="#ffcdd2" size={48} onClick={() => alert('삭제')} /> */
}
