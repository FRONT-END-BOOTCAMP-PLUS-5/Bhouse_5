// _components/ActivityTabs/ActivityTabs.tsx

'use client'

import React, { useState } from 'react'
import styles from './ActivityTabs.module.css'
import PostCommentList from './PostCommentList'

import { fetchMyPostsData, fetchMyRepliesData } from 'models/querys/myactivity.query'
import { useQuery } from '@tanstack/react-query'

type TabType = 'posts' | 'comments'

const ActivityTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts')

  // 내 게시글 데이터 가져오기
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPostsData,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  })
  const myPosts = postsData?.data || [] // 데이터가 없으면 빈 배열

  // 내 덧글 데이터 가져오기
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
  } = useQuery({
    queryKey: ['myReplies'],
    queryFn: fetchMyRepliesData,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  })
  const myComments = repliesData?.data || [] // 데이터가 없으면 빈 배열

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
  }

  // 로딩 및 에러 처리
  if (isLoadingPosts || isLoadingReplies) {
    return <div className={styles.container}>로딩 중...</div>
  }

  if (isErrorPosts || isErrorReplies) {
    return <div className={styles.container}>데이터를 불러오는 데 실패했습니다.</div>
  }

  // 댓글 데이터를 PostCommentList 컴포넌트에 맞게 변환
  const formattedComments = myComments.map((comment) => ({
    id: comment.reply_id,
    title: comment.text,
    date: new Date(comment.created_at).toLocaleDateString('ko-KR'),
    views: 0,
  }))

  // 게시글 데이터 형식에 맞게 변환
  const formattedPosts = myPosts.map((post) => ({
    id: post.id,
    title: post.title,
    date: new Date(post.createdAt).toLocaleDateString('ko-KR'),
    views: post.hits,
  }))

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
        {activeTab === 'posts' && <PostCommentList data={formattedPosts} type="post" />}
        {activeTab === 'comments' && <PostCommentList data={formattedComments} type="comment" />}
      </div>
    </div>
  )
}

export default ActivityTabs
