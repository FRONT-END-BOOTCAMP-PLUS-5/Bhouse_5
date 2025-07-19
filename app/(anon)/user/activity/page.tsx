// app/my-activity/page.tsx
'use client'

import React from 'react'
import styles from '@/page.module.css' // app/page.module.css 임포트
import UserProfile from './_components/UserProfile' // UserProfile 컴포넌트 임포트
import ActivityTabs from './_components/ActivityTabs'

export default function MyActivityPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.header48}>내 활동 보기</h1>
      <div className="flex-grow flex justify-center items-start p-4">
        <UserProfile />
        <ActivityTabs />
      </div>
    </main>
  )
}
