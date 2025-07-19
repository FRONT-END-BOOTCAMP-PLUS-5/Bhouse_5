'use client'

import instance from '@utils/instance'
import styles from './PostDetail.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Post {
  id: number
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  category_id: number
  town: string
  username: string
}

export default function PostDetailPage({ post }: { post: Post }) {
  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await instance.get('/api/auth/me')
        setIsAuthor(res.data.userId === post.user_id)
      } catch (err) {
        console.error('유저 인증 실패', err)
      }
    }

    fetchCurrentUser()
  }, [post.user_id])

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>커뮤니티 &gt; 자유게시판</div>

      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.metaWrapper}>
        <div className={styles.userBlock}>
          <Image src="/profile-default.png" alt="작성자 프로필" width={40} height={40} className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.username}>{post.username}</span>
            <span className={styles.date}>
              {new Date(post.created_at).toLocaleString()} · {post.town}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className={styles.actions}>
            <button className={styles.editBtn}>수정</button>
            <button className={styles.deleteBtn}>삭제</button>
          </div>
        )}
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}
