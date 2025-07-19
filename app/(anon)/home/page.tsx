// app/home/page.tsx
'use client' // 클라이언트 컴포넌트로 지정

import React from 'react'
import BoardgameList from './_components/BoardgameList' // BoardgameList 컴포넌트 경로
import styles from '@/page.module.css' // app/page.module.css 임포트

export default function TestBoardgamesPage() {
  return (
    <main className={styles.page}>
      {' '}
      {/* app/page.module.css의 .page 스타일 적용 */}
      <div className="container mx-auto p-4">
        {' '}
        {/* Tailwind CSS 클래스 사용 (예시) */}
        <h1 className={styles.header20}>보드게임 목록 테스트 페이지</h1>
        <BoardgameList /> {/* BoardgameList 컴포넌트 렌더링 */}
      </div>
    </main>
  )
}
