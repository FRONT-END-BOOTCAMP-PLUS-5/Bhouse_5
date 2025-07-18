'use client'

import React from 'react'
import ImageUploader from '@/_components/ImageUploader/ImageUploader'

interface ImageUploadFormProps {
  onImageSelect: (file: File) => void
}

export default function ImageUploadForm({ onImageSelect }: ImageUploadFormProps) {
  const handleSelect = (files: File[]) => {
    if (files.length > 0) {
      onImageSelect(files[0]) // 대표 이미지 1장만 넘김
    }
  }

  return (
    <div>
      <label>대표이미지</label>
      <ImageUploader onImagesSelect={handleSelect} />
      <label htmlFor="">메뉴이미지</label>
      <ImageUploader onImagesSelect={handleSelect} />
    </div>
  )
}
