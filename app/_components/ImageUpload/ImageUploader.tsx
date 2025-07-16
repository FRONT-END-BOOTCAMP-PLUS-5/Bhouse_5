'use client'

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react'
import styles from './ImageUploader.module.css'
import Image from 'next/image'

interface ImageUploaderProps {
  onImagesSelect?: (files: File[]) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelect }) => {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)

    // callback
    onImagesSelect?.(fileArray)

    const urls = fileArray.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...urls])
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className={styles.imgContainer}>
      <div
        className={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>클릭 또는 드래그해서 이미지를 업로드하세요</p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className={styles.previewContainer}>
        {previews.map((src, idx) => (
          <div key={idx} className={styles.previewWrapper}>
            <Image
              src={src}
              alt={`업로드된 이미지 ${idx + 1}`}
              width={120}
              height={120}
              className={styles.previewImage}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploader
