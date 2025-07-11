'use client'

import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <div>Bhouse_5</div>
      <h1 className={styles.boldText}>환영합니다!</h1>
      <p className={styles.regularText}>이것은 나눔스퀘어 레귤러 텍스트입니다.</p>
      <p className={styles.lightText}>이것은 나눔스퀘어 라이트 텍스트입니다.</p>
      <p className={styles.extraBoldText}>이것은 나눔스퀘어 엑스트라볼드 텍스트입니다.</p>
      <button className={styles.button}>클릭하세요</button>
    </div>
  )
}
