// _components/ActivityTabs/ActivityTabs.tsx
'use client'

import React, { useState, useEffect } from 'react' // useEffect 임포트
import styles from './ActivityTabs.module.css'
import PostCommentList from './PostCommentList'

import { fetchMyPostsData, fetchMyRepliesData } from 'models/querys/myactivity.query'
import { useQuery } from '@tanstack/react-query'
import { useUserActivityStore } from '@store/userActivity.store' // 새로 생성한 스토어 임포트

type TabType = 'posts' | 'comments'

const ActivityTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('posts')
  const setActivityCounts = useUserActivityStore((state) => state.setActivityCounts) // 스토어의 setter 가져오기

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

  // 데이터가 로드되면 전역 스토어에 업데이트
  useEffect(() => {
    if (!isLoadingPosts && !isErrorPosts && postsData) {
      setActivityCounts(myPosts.length, myComments.length)
    }
  }, [myPosts.length, myComments.length, isLoadingPosts, isErrorPosts, postsData, setActivityCounts])

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
    id: comment.reply_id, // 댓글 자체의 ID (key로 사용)
    title: comment.text,
    date: new Date(comment.created_at).toLocaleDateString('ko-KR'),
    views: 0,
    link_id: comment.post_id, // 부모 게시글의 ID를 link_id로 전달
  }))

  // 게시글 데이터 형식에 맞게 변환
  const formattedPosts = myPosts.map((post) => ({
    id: post.id,
    title: post.title,
    date: new Date(post.createdAt).toLocaleDateString('ko-KR'),
    views: post.hits,
    link_id: post.id, // 게시글 자체의 ID를 link_id로 전달
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
