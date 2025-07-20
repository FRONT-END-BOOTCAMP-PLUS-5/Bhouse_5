// components/PostList.tsx
'use client'

import instance from '@utils/instance'
import styles from './PostList.module.css'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Post {
  hits: ReactNode
  postId: number
  title: string
  commentCount?: number
  town: string
  nickname: string
  createdAt: string
  isNotice?: boolean
}

interface PostListProps {
  posts: Post[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  tabId?: number // ← 탭 ID를 받아서 조건 분기
}

export default function PostList({ posts, currentPage, totalPages, onPageChange, tabId }: PostListProps) {
  const formatTime = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getPagination = () => {
    const range = 2
    const pages = []
    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.titleCol}>제목</th>
            <th>작성자</th>
            {tabId === 1 && <th>동네</th>}
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.postId} className={styles.postRow}>
              <td data-label="제목">
                {post.isNotice && <span className={styles.noticeBadge}>공지</span>}
                <Link
                  href={`/community/posts/${post.postId}`}
                  className={styles.titleLink}
                  onClick={async (e) => {
                    e.preventDefault()
                    try {
                      await instance.patch(`/api/community/posts/${post.postId}/hits`)
                    } catch (err) {
                      console.error('조회수 증가 실패', err)
                    } finally {
                      window.location.href = `/community/posts/${post.postId}`
                    }
                  }}
                >
                  {post.title} {post.commentCount != null ? `[${post.commentCount}]` : ''}
                </Link>
              </td>
              <td data-label="작성자">{post.nickname}</td>
              {tabId === 1 && (
                <td data-label="동네">
                  <span className={styles.townBadge}>{post.town?.split(' ').pop() ?? ''}</span>
                </td>
              )}
              <td data-label="작성일">{formatTime(post.createdAt)}</td>
              <td data-label="조회수">{post.hits}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className={styles.pagination}>
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          {'<<'}
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          {'<'}
        </button>

        {currentPage > 3 && <span className={styles.ellipsis}>...</span>}
        {getPagination().map((page) => (
          <button
            key={page}
            className={page === currentPage ? styles.activePage : ''}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 2 && <span className={styles.ellipsis}>...</span>}

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          {'>'}
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
          {'>>'}
        </button>
      </div>
    </div>
  )
}
