// src/app/user/setting/page.tsx
'use client'

import React, { useEffect } from 'react' // useEffect import 추가
import styles from './page.module.css' // 페이지 전용 CSS 모듈
import Toggle from '@/_components/Toggle/Toggle' // Toggle 컴포넌트 경로
import KeywordListForm from './_components/KeywordListForm' // KeywordListForm 컴포넌트 경로
import globalStyles from '@/page.module.css'
import { useGetUserSettings, usePatchUserSettings } from 'models/querys/setting.query' // 새로 생성한 쿼리 훅 임포트

const UserSettingPage: React.FC = () => {
  // useGetUserSettings 훅을 사용하여 사용자 설정 데이터 가져오기
  const { data: userSettings, isLoading, isError, error } = useGetUserSettings()
  // usePatchUserSettings 훅을 사용하여 설정 업데이트 뮤테이션 가져오기
  const patchSettings = usePatchUserSettings()

  // 초기 토글 상태는 GET 요청 데이터에 따라 설정됩니다.
  // 로딩 중이거나 데이터가 없으면 기본값으로 'Y'를 사용합니다.
  const isReplyNotificationsEnabled = userSettings?.reply === 'Y'
  const isKeywordNotificationsEnabled = userSettings?.keyword === 'Y'

  // 로딩 중일 때 또는 에러 발생 시 UI 처리
  if (isLoading) {
    return (
      <div className={globalStyles.page}>
        <h1 className={`${globalStyles.header48} ${globalStyles.pageTitle}`}>알림 설정</h1>
        <p>설정 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (isError) {
    console.error('사용자 설정 로딩 에러:', error)
    return (
      <div className={globalStyles.page}>
        <h1 className={`${globalStyles.header48} ${globalStyles.pageTitle}`}>알림 설정</h1>
        <p>설정 정보를 불러오는데 실패했습니다. 다시 시도해주세요.</p>
      </div>
    )
  }

  const handleReplyToggleChange = (checked: boolean) => {
    const newReplyStatus = checked ? 'Y' : 'N'
    console.log('새 댓글 알림:', newReplyStatus)
    // PATCH API 호출하여 서버에 설정 변경 사항 반영
    patchSettings.mutate({ reply: newReplyStatus })
  }

  const handleKeywordToggleChange = (checked: boolean) => {
    const newKeywordStatus = checked ? 'Y' : 'N'
    console.log('키워드 알림:', newKeywordStatus)
    // PATCH API 호출하여 서버에 설정 변경 사항 반영
    patchSettings.mutate({ keyword: newKeywordStatus })
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
