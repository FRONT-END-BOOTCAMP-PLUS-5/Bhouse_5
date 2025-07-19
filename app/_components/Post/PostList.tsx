// components/PostList.tsx
'use client'

import styles from './PostList.module.css'
import Link from 'next/link'

interface Post {
  postId: number
  title: string
  commentCount?: number
  town: string
  nickname: string
  createdAt: string
  isNotice?: boolean
}

interface PostListProps {
  posts: Post[] // 🔥 현재 페이지의 post만 받음
  currentPage: number
  totalPages: number // 🔥 전체 페이지 수를 따로 받음
  onPageChange: (page: number) => void
}

export default function PostList({ posts, currentPage, totalPages, onPageChange }: PostListProps) {
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
            <th>동네</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.postId} className={styles.postRow}>
              <td data-label="제목">
                {post.isNotice && <span className={styles.noticeBadge}>공지</span>}
                <Link href={`/community/posts/${post.postId}`} className={styles.titleLink}>
                  {post.title} {post.commentCount ? `[${post.commentCount}]` : ''}
                </Link>
              </td>
              <td data-label="작성자">{post.nickname}</td>
              <td data-label="동네">
                <span className={styles.townBadge}>{post.town}</span>
              </td>
              <td data-label="작성일">{formatTime(post.createdAt)}</td>
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
