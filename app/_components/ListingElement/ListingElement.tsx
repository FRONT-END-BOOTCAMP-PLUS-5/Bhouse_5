'use client'

import React from 'react'
import styles from './ListingElement.module.css'
import CircleButton from '../CircleButton/CircleButton'
import TrashIcon from '@public/icons/trash.svg'

interface ListingElementProps {
  label: string
  onDelete: () => void
}

const ListingElement: React.FC<ListingElementProps> = ({ label, onDelete }) => {
  return (
    <div className={styles.boardgameItem}>
      <div className={styles.boardgameLabel}>{label}</div>
      <CircleButton
        svgComponent={TrashIcon} // BellIcon 컴포넌트를 직접 전달
        svgWidth={20} // 아이콘 너비
        svgHeight={20} // 아이콘 높이
        svgFill="black" // 아이콘 색상
        imageAlt="삭제 아이콘" // 접근성용 대체 텍스트
        bgColor="var(--secondary-blue-200)"
        size={40}
        onClick={() => alert('파일 아이콘 클릭')} // onClick 메시지를 더 구체적으로 변경했습니다.
      />
    </div>
  )
}

export default ListingElement
