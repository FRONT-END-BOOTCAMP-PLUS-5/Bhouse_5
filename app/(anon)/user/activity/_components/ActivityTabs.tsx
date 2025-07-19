// _components/ActivityTabs/ActivityTabs.tsx
'use client'

import React, { useState } from 'react'
import styles from './ActivityTabs.module.css'
import PostCommentList from './PostCommentList' // PostCommentList 임포트

// 더미 데이터
const dummyPosts = [
  { id: 1, title: '[질문] 시사마피아 책은 어디에...', date: '2025.07.05', views: 2 },
  { id: 2, title: '[모임] 세상에 마피아는 없다. [0]', date: '2025.06.05', views: 44 },
  { id: 3, title: '[구인] 부산 맛집 마피아피피...', date: '2025.07.05', views: 14 },
  { id: 4, title: '[모임] 세상에 마피아는 없...', date: '2024.05.05', views: 55 },
  { id: 5, title: '[자유] 어제 마피아 게임 했 ... [0]', date: '2025.07.05', views: 23 },
  { id: 6, title: '[구인] 부산 맛집 마피아아!... [2]', date: '2024.04.05', views: 2 },
  { id: 7, title: '[구인] 종로구 마피아 번..[10]', date: '2024.03.05', views: 14 },
  { id: 8, title: '[자유] 어제 마피아 게임 했 ... [0]', date: '2024.02.05', views: 23 },
  { id: 9, title: '[질문] 시사마피아 책은 어디에...', date: '2024.01.05', views: 44 },
  { id: 10, title: '[구인] 종로구 마피아 번..[10]', date: '2024.01.04', views: 55 },
]

const dummyComments = [
  { id: 11, title: '해당 게시글에 대한 첫 번째 덧글입니다.', date: '2025.07.10', views: 1 },
  { id: 12, title: '두 번째 덧글은 이렇게 쓰여있습니다.', date: '2025.07.09', views: 5 },
  { id: 13, title: '세 번째 덧글 내용입니다. 길어질수도 있어요.', date: '2025.07.08', views: 10 },
  { id: 14, title: '네 번째 덧글 테스트.', date: '2025.07.07', views: 3 },
  { id: 15, title: '다섯 번째 덧글입니다.', date: '2025.07.06', views: 7 },
]

type TabType = 'posts' | 'comments'

const ActivityTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts')

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === 'posts' ? styles.active : ''}`}
          onClick={() => handleTabClick('posts')}
        >
          내 게시글
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'comments' ? styles.active : ''}`}
          onClick={() => handleTabClick('comments')}
        >
          내 덧글
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'posts' && <PostCommentList data={dummyPosts} type="post" />}
        {activeTab === 'comments' && <PostCommentList data={dummyComments} type="comment" />}
      </div>
    </div>
  )
}

export default ActivityTabs
