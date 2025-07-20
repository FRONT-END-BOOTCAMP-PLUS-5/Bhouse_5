'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuillEditor from '@/_components/Quill/PostQuill'
import { useCreatePostMutation, useUpdatePostMutation, usePostDetailQuery } from 'models/querys/community.query'

interface PostWriteFormProps {
  postId?: number
}

export default function PostWriteForm({ postId }: PostWriteFormProps) {
  const router = useRouter()
  const isEditMode = !!postId
  const { data: post } = usePostDetailQuery(postId ?? 0, { enabled: isEditMode })
  const { mutate: createPost } = useCreatePostMutation()
  const { mutate: updatePost } = useUpdatePostMutation()

  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setUserId(data.userId)
      } catch (e) {
        console.error('유저 정보 조회 실패', e)
      }
    }
    fetchUser()
  }, [])

  const handleParsed = (title: string, content: string) => {
    if (!userId) {
      alert('로그인이 필요합니다.')
      return
    }

    const payload = {
      userId,
      title,
      content,
      categoryId: 1,
      town: '서울시 강남구',
    }

    if (isEditMode && postId) {
      updatePost(
        { ...payload, postId },
        {
          onSuccess: () => {
            alert('수정 완료!')
            router.push(`/community/posts/${postId}`)
          },
        },
      )
    } else {
      createPost(payload, {
        onSuccess: () => {
          alert('작성 완료!')
          router.push('/community/posts')
        },
      })
    }
  }

  return (
    <div>
      <h1>{isEditMode ? '글 수정' : '글쓰기'}</h1>
      <QuillEditor
        title={post?.title || ''}
        content={post?.content || ''}
        onChange={() => {}}
        onParsed={handleParsed}
      />
    </div>
  )
}
