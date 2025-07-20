// app/my-activity/page.tsx

'use client'

import React from 'react'
import globalCss from '@/page.module.css' // app/page.module.css 임포트 (이름 변경)
import localStyles from './myActivityPage.module.css' // 새로 생성된 CSS 모듈 임포트
import UserProfile from './_components/UserProfile' // UserProfile 컴포넌트 임포트
import ActivityTabs from './_components/ActivityTabs'

export default function MyActivityPage() {
  return (
    <main className={globalCss.page}>
      <h1 className={globalCss.header48}>내 활동 보기</h1> {/* globalCss.header48 사용 */}
      <div className={localStyles.contentContainer}>
        {' '}
        {/* Tailwind 클래스 대신 CSS 모듈 클래스 적용 */}
        {/* UserProfile을 감싸는 div: 모바일에서 전체 너비, 중간 화면 이상에서 자동으로 너비 조정 */}
        <div className={localStyles.profileWrapper}>
          {' '}
          {/* Tailwind 클래스 대신 CSS 모듈 클래스 적용 */}
          <UserProfile />
        </div>
        {/* ActivityTabs를 감싸는 div: 모바일에서 전체 너비, 중간 화면 이상에서 자동으로 너비 조정 및 남은 공간 채우기 */}
        <div className={localStyles.tabsWrapper}>
          {' '}
          {/* Tailwind 클래스 대신 CSS 모듈 클래스 적용 */}
          <ActivityTabs />
        </div>
      </div>
    </main>
  )
}
