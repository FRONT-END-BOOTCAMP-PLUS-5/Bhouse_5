// _components/PostCommentList/PostCommentList.tsx
'use client'

import React from 'react'
import styles from './PostCommentList.module.css'

interface ListItem {
  id: number
  title: string
  date: string
  views: number
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
            data.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td className={styles.cellTitle}>{item.title}</td>
                <td className={styles.cellDate}>{item.date}</td>
                <td className={styles.cellViews}>{item.views}</td>
              </tr>
            ))
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
