// src/app/user/setting/page.tsx
'use client'

import React, { useState } from 'react'
import styles from './page.module.css' // 페이지 전용 CSS 모듈
import Toggle from '@/_components/Toggle/Toggle' // Toggle 컴포넌트 경로
import KeywordListForm from './_components/KeywordListForm' // KeywordListForm 컴포넌트 경로
import globalStyles from '@/page.module.css'

const UserSettingPage: React.FC = () => {
  // 알림 설정 토글 상태
  const [isReplyNotificationsEnabled, setIsReplyNotificationsEnabled] = useState(true)
  const [isKeywordNotificationsEnabled, setIsKeywordNotificationsEnabled] = useState(true)

  // TODO: 실제 사용자 설정 데이터는 API를 통해 가져와야 합니다.
  // 예: const { data: userSettings, isLoading } = useGetUserSettings();

  const handleReplyToggleChange = (checked: boolean) => {
    setIsReplyNotificationsEnabled(checked)
    console.log('새 댓글 알림:', checked ? '켜짐' : '꺼짐')
    // TODO: API 호출하여 서버에 설정 변경 사항 반영
  }

  const handleKeywordToggleChange = (checked: boolean) => {
    setIsKeywordNotificationsEnabled(checked)
    console.log('키워드 알림:', checked ? '켜짐' : '꺼짐')
    // TODO: API 호출하여 서버에 설정 변경 사항 반영
  }

  return (
    <div className={globalStyles.page}>
      <h1 className={`${globalStyles.header48} ${globalStyles.pageTitle}`}>알림 설정</h1>

      <div className={styles.notificationSection}>
        <div className={styles.notificationItem}>
          <span className={`${globalStyles.body20} ${styles.notificationLabel}`}>새 댓글 알림</span>
          <Toggle checked={isReplyNotificationsEnabled} onChange={handleReplyToggleChange} size="medium" />
        </div>
        <div className={styles.notificationItem}>
          <span className={`${globalStyles.body20} ${styles.notificationLabel}`}>키워드 알림</span>
          <Toggle checked={isKeywordNotificationsEnabled} onChange={handleKeywordToggleChange} size="medium" />
        </div>
      </div>

      <h2 className={`${globalStyles.header20} ${styles.keywordListTitle}`}>게시글 키워드 등록</h2>
      <KeywordListForm />
    </div>
  )
}

export default UserSettingPage
