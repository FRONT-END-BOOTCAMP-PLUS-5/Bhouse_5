// app/place-register/PlaceForm.tsx

'use client'

import TextInput from '@/_components/TextInput/TextInput'
import styles from './page.module.css'
import ImageUploadForm from './ImageUploadForm'
// import ImageUploader from './ImageUploader'

export default function PlaceForm() {
  function handleImageSelect(file: File): void {
    throw new Error('Function not implemented.')
  }

  return (
    <form className={styles.form}>
      <label>매장명</label>
      <TextInput className="textInput" placeholder="매장 명을 입력해주세요." />

      <label>대표 이미지</label>
      <ImageUploadForm onImageSelect={handleImageSelect} />

      <label>가격표 이미지</label>
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
