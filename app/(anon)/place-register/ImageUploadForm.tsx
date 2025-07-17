'use client'

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react'
import styles from './page.module.css'

interface ImageUploadFormProps {
  onImagesSelect?: (files: File[]) => void
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onImagesSelect }) => {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    if (onImagesSelect) onImagesSelect(fileArray)

    const previewUrls = fileArray.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...previewUrls])
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
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
          <img key={idx} src={src} alt={`업로드된 이미지 ${idx + 1}`} className={styles.previewImage} />
        ))}
      </div>
    </div>
  )
}

export default ImageUploadForm
