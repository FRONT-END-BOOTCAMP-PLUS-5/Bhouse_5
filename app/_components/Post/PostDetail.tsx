'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './PostDetail.module.css'
import Image from 'next/image'
import { useDeletePostMutation, usePostDetailQuery } from 'models/querys/community.query'
import instance from '@utils/instance'
import ReplyForm from './Replyform'
import ReplyList from './ReplyList'

interface PostDetailPageProps {
  postId: number
}

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const router = useRouter()
  const { data: post, isLoading } = usePostDetailQuery(postId, { enabled: !!postId })
  const [isAuthor, setIsAuthor] = useState(false)
  const { mutate: deletePost } = useDeletePostMutation()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get('/api/auth/me')
        const uid = res.data.userId
        setUserId(uid) // ✅ 추가
        if (post) setIsAuthor(uid === post.userId)
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

      {/* 댓글 작성 */}
      <div className={styles.replySection}>
        <h2>댓글</h2>
        {!userId ? (
          <p>
            댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
          </p>
        ) : (
          <ReplyForm postId={postId} userId={userId} />
        )}
        <ReplyList postId={postId} userId={userId || ''} />
      </div>
    </div>
  )
}
