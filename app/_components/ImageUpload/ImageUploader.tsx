import React from 'react'
import styles from './ImageUpload.module.css'
import Button from '@/_components/Button/Button'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className={styles.imageUpload}>
      <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
      <Button className={styles.uploadButton}>이미지 업로드</Button>
    </div>
  )
}

export default ImageUpload
