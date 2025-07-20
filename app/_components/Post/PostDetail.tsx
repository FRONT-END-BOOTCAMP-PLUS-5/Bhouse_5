'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './PostDetail.module.css'
import Image from 'next/image'
import { useDeletePostMutation, usePostDetailQuery } from 'models/querys/community.query'
import instance from '@utils/instance'

interface PostDetailPageProps {
  postId: number
}

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const router = useRouter()
  const { data: post, isLoading } = usePostDetailQuery(postId, { enabled: !!postId })
  const [isAuthor, setIsAuthor] = useState(false)
  const { mutate: deletePost } = useDeletePostMutation()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get('/api/auth/me')
        if (post) setIsAuthor(res.data.userId === post.userId)
      } catch (err) {
        console.error('유저 인증 실패', err)
      }
    }

    fetchUser()
  }, [post?.userId])

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deletePost(postId, {
        onSuccess: () => {
          alert('삭제되었습니다.')
          router.push('/community/posts')
        },
        onError: (err) => {
          alert('삭제 실패: ' + (err as Error).message)
        },
      })
    }
  }

  const handleEdit = () => {
    const params = new URLSearchParams({ id: postId.toString() })
    router.push(`/community/posts/write?${params}`)
  }

  if (isLoading || !post) return <div>불러오는 중...</div>

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
              {new Date(post.createdAt).toLocaleString()} · {post.town}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={handleEdit}>
              수정
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}
