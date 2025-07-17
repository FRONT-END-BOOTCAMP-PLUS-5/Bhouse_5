'use client'

import React from 'react'
import styles from './ListingElement.module.css'
import CircleButton from '../CircleButton/CircleButton'
import FileIcon from '@public/icons/trash.svg'

interface ListingElementProps {
  label: string
  onDelete: () => void
}
//TODO:button circle로 바꾸기

const ListingElement: React.FC<ListingElementProps> = ({ label, onDelete }) => {
  return (
    <div className={styles.boardgameItem}>
      <div className={styles.boardgameLabel}>{label}</div>
      <CircleButton
        icon={<FileIcon width={20} height={20} fill="black" />} // iconSize 대신 width, height를 직접 지정합니다. 상단에서 import한 아이콘을 가져옵니다.
        //사용할 svg아이콘의 파일에서 fill값을 "currentColor"로 지정해야 색상을 바꿀 수 있습니다. (예시 파일 : bell, file, trash 수정하였음.)
        iconAlt="파일" // iconAlt는 CircleButton 인터페이스에는 있지만, FileIcon 컴포넌트 자체에서 alt를 관리할 수도 있습니다.
        size={40}
        onClick={() => alert('파일 아이콘 클릭')} // onClick 메시지를 더 구체적으로 변경했습니다.
      />
    </div>
  )
}

export default ListingElement
