'use client'

import React from 'react'
import Image from 'next/image'
import CircleButton from '../CircleButton/CircleButton'
import styles from './ImageUploader.module.css'
import PlusIcon from '@public/icons/plus.svg'

interface ImagePreviewListProps {
  previews: string[]
  onUploadClick: () => void
}

const ImagePreviewList: React.FC<ImagePreviewListProps> = ({ previews, onUploadClick }) => {
  if (previews.length === 0) {
    return (
      <div className={styles.dropZoneLarge} onClick={onUploadClick}>
        <div className={styles.uploadIcon}>
          <CircleButton
            svgComponent={PlusIcon} // BellIcon 컴포넌트를 직접 전달
            svgWidth={48} // 아이콘 너비
            svgHeight={48} // 아이콘 높이
            svgFill="black" // 아이콘 색상
            imageAlt="추가 아이콘" // 접근성용 대체 텍스트
            bgColor="#fff"
            size={32}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.previewContainer}>
      {previews.map((src, idx) => (
        <div key={idx} className={`${styles.previewWrapper} ${idx === 0 ? styles.representative : ''}`}>
          <Image
            src={src}
            alt={`업로드된 이미지 ${idx + 1}`}
            width={120}
            height={120}
            className={styles.previewImage}
            unoptimized
          />
        </div>
      ))}

      <div className={styles.dropZoneSmall} onClick={onUploadClick}>
        <div className={styles.uploadIcon}>
          <CircleButton
            svgComponent={PlusIcon} // BellIcon 컴포넌트를 직접 전달
            svgWidth={48} // 아이콘 너비
            svgHeight={48} // 아이콘 높이
            svgFill="black" // 아이콘 색상
            imageAlt="추가 아이콘" // 접근성용 대체 텍스트
            bgColor="#fff"
            size={32}
          />
        </div>
      </div>
    </div>
  )
}

export default ImagePreviewList
