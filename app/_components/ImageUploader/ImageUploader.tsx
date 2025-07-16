// /components/ImageUploader/ImageUploader.tsx
'use client'

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react'
import styles from './ImageUploader.module.css'
import ImagePreviewList from './ImagePreviewList'

interface ImageUploaderProps {
  onImagesSelect?: (files: File[]) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelect }) => {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
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

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.imgContainer}>
      <div className={styles.dropZone} onDrop={handleDrop} onDragOver={handleDragOver} onClick={openFileDialog}>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      <ImagePreviewList previews={previews} onUploadClick={openFileDialog} />
    </div>
  )
}

export default ImageUploader
