'use client'

import { useState } from 'react'
import QuillEditor from '@/_components/Quill/PostQuill' // 방금 만든 quill 컴포넌트
import TextInput from '@/_components/TextInput/TextInput'
import instance from '@utils/instance'

export default function WritePostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    try {
      const res = await instance.post('/api/community/posts', {
        title,
        content,
        categoryId: 1,
        town: '서울시 강남구',
      })

      if (!res.ok) throw new Error('글쓰기 실패')

      alert('글이 등록되었습니다.')
      // redirect('/community/posts') 등으로 이동 가능
    } catch (e) {
      alert('에러: ' + e)
    }
  }

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: 24 }}>
      <h1>글쓰기</h1>
      <QuillEditor
        value={content}
        onChange={setContent}
        onParsed={function (title: string, content: string): void {
          throw new Error('Function not implemented.')
        }}
      />
    </div>
  )
}
