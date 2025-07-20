// _components/UserProfile/UserProfile.tsx
'use client'

import React from 'react'
import CircleButton from '@/_components/CircleButton/CircleButton'
import styles from './UserProfile.module.css'
import { useAuthStore } from '@store/auth.store'
import { useUserActivityStore } from '@store/userActivity.store' // 새로 생성한 스토어 임포트

const UserProfile: React.FC = () => {
  const { user } = useAuthStore()
  const { postsCount, commentsCount } = useUserActivityStore() // 스토어에서 데이터 가져오기

  const profileImageUrl = user?.profile_img_url || 'https://placehold.co/70x70/cccccc/ffffff?text=No+Image'
  const userName = user?.nickname || 'Guest'

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileContent}>
        <div className={styles.profileImageContainer}>
          <CircleButton
            imageUrl={profileImageUrl}
            imageSize={70}
            imageAlt="프로필 이미지"
            bgColor="transparent"
            size={80}
          />
        </div>

        <div className={styles.profileInfo}>
          <span className={styles.userName}>{userName}</span>
          <div className={styles.activityStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>작성글</span>
              <span className={styles.statValue}>{postsCount !== null ? postsCount : '-'}</span> {/* null 처리 */}
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>작성덧글</span>
              <span className={styles.statValue}>{commentsCount !== null ? commentsCount : '-'}</span> {/* null 처리 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
