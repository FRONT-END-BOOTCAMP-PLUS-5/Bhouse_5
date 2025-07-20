// _components/PostCommentList/PostCommentList.tsx
'use client'

import React from 'react'
import styles from './PostCommentList.module.css'
import Link from 'next/link' // next/link 임포트

interface ListItem {
  id: number // 게시글 ID 또는 댓글 ID
  title: string
  date: string
  views: number
  link_id?: number // 댓글의 경우 부모 post_id, 게시글의 경우 id와 동일 (옵셔널)
}

interface PostCommentListProps {
  data: ListItem[]
  type: 'post' | 'comment' // 게시글 또는 덧글 타입
}

const PostCommentList: React.FC<PostCommentListProps> = ({ data, type }) => {
  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerTitle}>제목</th>
            <th className={styles.headerDate}>작성일</th>
            <th className={styles.headerViews}>조회</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => {
              // 게시글이면 item.id, 댓글이면 item.link_id (부모 post_id) 사용
              const targetId = item.link_id || item.id
              const href = `/community/posts/${targetId}`

              return (
                <tr key={item.id} className={styles.tableRow}>
                  <td className={styles.cellTitle}>
                    {/* Link 컴포넌트를 사용하여 클릭 가능하게 만듬 */}
                    <Link href={href} className={styles.titleLink}>
                      {item.title}
                    </Link>
                  </td>
                  <td className={styles.cellDate}>{item.date}</td>
                  <td className={styles.cellViews}>{item.views}</td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={3} className={styles.noData}>
                {type === 'post' ? '작성된 게시글이 없습니다.' : '작성된 덧글이 없습니다.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PostCommentList
