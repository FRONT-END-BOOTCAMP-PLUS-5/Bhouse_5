'use client'

import React, { useState } from 'react'
import TextInput from '@/_components/TextInput/TextInput'
import styles from '../page.module.css'
import ImageUploadForm from './ImageUploadForm'

export default function PlaceForm() {
  const [mainImage, setMainImage] = useState<File | null>(null)

  function handleImageSelect(file: File): void {
    setMainImage(file)
    console.log('대표 이미지 선택됨:', file)
  }

  return (
    <form className={styles.form}>
      <label>매장명</label>
      <TextInput className="textInput" placeholder="매장 명을 입력해주세요." />

      <ImageUploadForm onImageSelect={handleImageSelect} />

      <label>주소</label>
      <TextInput className="textInput" placeholder="주소를 입력해주세요." />

      <label>한줄 설명(50자 제한)</label>
      <TextInput className="textInput" placeholder="전화번호를 입력해주세요." />

      <label>영업일</label>
      <TextInput className="textInput" placeholder="영업일을 입력해주세요." />
    </form>
  )
}
