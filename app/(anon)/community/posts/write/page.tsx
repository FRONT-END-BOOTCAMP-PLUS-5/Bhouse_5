'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuillEditor from '@/_components/Quill/PostQuill'
import { useCreatePostMutation } from 'models/querys/community.query'
import instance from '@utils/instance'

export default function WritePostPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const { mutate: createPost } = useCreatePostMutation()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get('/api/auth/me')
        setUserId(res.data.userId)
      } catch (e) {
        console.error('유저 정보 조회 실패', e)
      }
    }

    fetchUser()
  }, [])

  const handleParsed = (title: string, content: string) => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (!userId) {
      alert('로그인이 필요합니다.')
      return
    }

    createPost(
      {
        userId,
        title,
        content,
        categoryId: 1,
        town: '서울시 강남구',
      },
      {
        onSuccess: () => {
          alert('글이 등록되었습니다.')
          router.push('/community/posts')
        },
        onError: (error) => {
          alert('에러 발생: ' + (error as Error).message)
        },
      },
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: 24 }}>
      <h1>글쓰기</h1>
      <QuillEditor value="" onChange={() => {}} onParsed={handleParsed} />
    </div>
  )
}
