'use client'

import React from 'react'
import Image from 'next/image'
import CircleButton from '../CircleButton/CircleButton'
import styles from './ImageUploader.module.css'

interface ImagePreviewListProps {
  previews: string[]
  onUploadClick: () => void
}

const ImagePreviewList: React.FC<ImagePreviewListProps> = ({ previews, onUploadClick }) => {
  if (previews.length === 0) {
    return (
      <div className={styles.dropZoneLarge} onClick={onUploadClick}>
        <div className={styles.uploadIcon}>
          <CircleButton iconSrc={'/icons/plus.svg'} iconAlt={'추가'} size={48} iconSize={32} bgColor="#fff" />
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
          <CircleButton iconSrc={'/icons/plus.svg'} iconAlt={'추가'} size={36} iconSize={24} bgColor="#fff" />
        </div>
      </div>
    </div>
  )
}

export default ImagePreviewList
