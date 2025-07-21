'use client'

import React, { useState } from 'react'
import { useCreateChildReply } from 'models/querys/reply.query'
import TextInput from '../TextInput/TextInput'

interface ChildReplyFormProps {
  postId: number
  parentReplyId: number
  userId: string
}

export default function ChildReplyForm({ postId, parentReplyId, userId }: ChildReplyFormProps) {
  const [content, setContent] = useState('')
  const { mutate, isPending } = useCreateChildReply(postId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    mutate({ userId, content, parentReplyId })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
      <TextInput
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답글을 입력하세요"
        rows={2}
        style={{ width: '100%', fontSize: '14px' }}
        required
      />
      <button type="submit" disabled={isPending} style={{ marginTop: '0.25rem', fontSize: '14px' }}>
        등록
      </button>
    </form>
  )
}
