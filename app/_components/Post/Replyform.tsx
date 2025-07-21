'use client'

import { useCreateReply } from 'models/querys/reply.query'
import React, { useState } from 'react'
import TextInput from '@/_components/TextInput/TextInput'
import styles from './ReplyForm.module.css'

interface ReplyFormProps {
  postId: number
  userId: string
}

export default function ReplyForm({ postId, userId }: ReplyFormProps) {
  const [content, setContent] = useState('')
  const { mutate, isPending } = useCreateReply(postId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    mutate({ userId, content })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextInput
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        rows={2}
        disabled={isPending}
        className={styles.input}
      />
      <button type="submit" disabled={isPending || !content.trim()} className={styles.button}>
        {isPending ? '등록 중...' : '등록'}
      </button>
    </form>
  )
}
