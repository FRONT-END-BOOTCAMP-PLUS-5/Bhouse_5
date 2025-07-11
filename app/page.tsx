'use client'

import styles from './page.module.css'
import Button from './_components/Button.tsx'

export default function Home() {
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
    </div>
  )
}
