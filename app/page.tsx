'use client'

import styles from './page.module.css'
import Button from './_components/Button.tsx'
import TextInput from './_components/TextInput'
import React from 'react'

export default function Home() {
  const [email, setEmail] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [search, setSearch] = React.useState('')

  return (
    <div className={styles.page}>
      <p className={styles.title48}>보드의 집</p>
      <h1 className={styles.boldText}>환영합니다!</h1>
      <p className={styles.regularText}>이것은 나눔스퀘어 레귤러 텍스트입니다.</p>
      <p className={styles.header48}>이것 텍스트입니다. (header48)</p>
      <p className={styles.extraBoldText}>이것은 나눔스퀘어 엑스트라볼드 텍스트입니다.</p>

      <button className={styles.button}>클릭하세요</button>

      <Button borderRadius="8" variant="primary">
        기본 버튼
      </Button>
      <Button borderRadius="16" variant="secondary">
        둥근 버튼
      </Button>
      <Button borderRadius="60" variant="ghost" size="small">
        아주 둥근 버튼
      </Button>
      <Button borderRadius="12" variant="primary" size="large" onClick={() => alert('클릭!')}>
        클릭!
      </Button>

      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // 가로 길이를 화면 비율에 맞춰 늘리고 싶다면 width: 100%를 className으로 전달
          className={styles.fullWidthInput} // CSS 모듈에 .fullWidthInput 정의 필요
        />
      </div>

      {/* 피그마의 '지금 인기있는 보드게임은?' 부분 - 검색 입력 */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="text"
          placeholder="지금 인기있는 보드게임은?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.fixedWidthInput}
        />
      </div>

      {/* 여러 줄 입력 (Textarea) 예시 */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="textarea"
          placeholder="여기에 상세 설명을 입력하세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.fullWidthTextarea}
        />
      </div>
    </div>
  )
}
