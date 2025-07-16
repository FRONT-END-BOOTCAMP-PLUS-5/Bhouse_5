'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import ImageUploader from '@/_components/ImageUpload/ImageUploader'

const ImageUploadForm: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleImagesSelect = (files: File[]) => {
    setUploadedFiles(files)
    console.log('폼에서 받은 이미지:', files)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 업로드 처리 로직 (예: Supabase, S3, API 호출 등)
    alert(`${uploadedFiles.length}장의 이미지를 제출했습니다!`)
  }

  return (
    <div onSubmit={handleSubmit} className={styles.imgContainer}>
      <ImageUploader onImagesSelect={handleImagesSelect} />

      {uploadedFiles.length > 0 && (
        <div className={styles.info}>
          <p>{uploadedFiles.length}장의 이미지가 선택되었습니다.</p>
        </div>
      )}
    </div>
  )
}

export default ImageUploadForm
