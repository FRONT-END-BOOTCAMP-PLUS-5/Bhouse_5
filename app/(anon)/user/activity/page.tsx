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
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 w-full max-w-screen-xl mx-auto">
        {/* UserProfile을 감싸는 div: 모바일에서 전체 너비, 중간 화면 이상에서 자동으로 너비 조정 */}
        <div className="w-full md:w-auto flex-shrink-0">
          <UserProfile />
        </div>
        {/* ActivityTabs를 감싸는 div: 모바일에서 전체 너비, 중간 화면 이상에서 자동으로 너비 조정 및 남은 공간 채우기 */}
        <div className="w-full md:w-auto flex-grow">
          <ActivityTabs />
        </div>
      </div>
    </main>
  )
}
