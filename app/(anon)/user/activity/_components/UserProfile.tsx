// _components/UserProfile/UserProfile.tsx
'use client'

import React from 'react'
import CircleButton from '@/_components/CircleButton/CircleButton' // CircleButton 컴포넌트 임포트 경로
import styles from './UserProfile.module.css' // UserProfile 컴포넌트 전용 CSS 모듈

const UserProfile: React.FC = () => {
  // 더미 데이터
  const profileImageUrl =
    'https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__original/img/FpyxH41Y6_ROoePAilPNEhXnzO8=/0x0/filters:format(jpeg)/pic3490053.jpg' // 프로필 이미지 URL
  const postsCount = 55 // 작성글 갯수
  const commentsCount = 105 // 작성덧글 갯수
  const userName = '내향인A' // 사용자 이름 (이미지에서 확인)

  return (
    <div className={styles.profileCard}>
      {/* 새로운 레이아웃 컨테이너: 이미지와 텍스트를 나란히 배치 */}
      <div className={styles.profileContent}>
        {/* 왼쪽: 프로필 이미지 */}
        <div className={styles.profileImageContainer}>
          <CircleButton
            imageUrl={profileImageUrl}
            imageSize={70} // 이미지 크기 조정
            imageAlt="프로필 이미지"
            bgColor="transparent"
            size={80} // 버튼 크기를 더 크게 조정하여 두 줄 공간 확보
          />
        </div>

        {/* 오른쪽: 닉네임과 활동 통계 */}
        <div className={styles.profileInfo}>
          <span className={styles.userName}>{userName}</span>
          <div className={styles.activityStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>작성글</span>
              <span className={styles.statValue}>{postsCount}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>작성덧글</span>
              <span className={styles.statValue}>{commentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
