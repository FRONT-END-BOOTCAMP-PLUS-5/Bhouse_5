// ListingElement.tsx
'use client'

import React from 'react'
import styles from './ListingElement.module.css'
import CircleButton from '../CircleButton/CircleButton'
import TrashIcon from '@public/icons/trash.svg'

interface ListingElementProps {
  label: string
  onDelete: () => void // onDelete 함수를 받습니다.
  disabled?: boolean // 새로 추가: 버튼 비활성화 상태를 위한 prop
}

const ListingElement: React.FC<ListingElementProps> = ({ label, onDelete, disabled }) => {
  return (
    <div className={styles.boardgameItem}>
      <div className={styles.boardgameLabel}>{label}</div>
      <CircleButton
        svgComponent={TrashIcon}
        svgWidth={20}
        svgHeight={20}
        svgFill="black"
        imageAlt="삭제 아이콘"
        bgColor="var(--secondary-blue-200)"
        size={40}
        onClick={onDelete} // ⭐ 이 부분을 수정했습니다. 이제 onDelete prop이 호출됩니다.
        disabled={disabled} // ⭐ 새로 추가: disabled prop을 CircleButton에 전달합니다.
      />
    </div>
  )
}

export default ListingElement
