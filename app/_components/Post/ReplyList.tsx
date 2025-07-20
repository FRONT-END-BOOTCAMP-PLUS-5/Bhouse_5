'use client'

import { useState } from 'react'
import { useReplies } from 'models/querys/reply.query'
import { Reply } from '../../../types/reply'
import ChildReplyForm from './ChildReplyForm'
import styles from './ReplyList.module.css'

import RecursiveReplyItem from './RecursiveReplyItem'

interface ReplyListProps {
  postId: number
  userId: string
}

export default function ReplyList({ postId, userId }: ReplyListProps) {
  const { data: replies = [], isLoading } = useReplies(postId)

  if (isLoading) return <p>로딩 중...</p>
  if (replies.length === 0) return <p className={styles.empty}>댓글이 없습니다.</p>

  const topLevelReplies = replies.filter((r) => r.parentReplyId === null)

  return (
    <ul className={styles.replyList}>
      {topLevelReplies.map((reply) => (
        <RecursiveReplyItem key={reply.replyId} reply={reply} replies={replies} postId={postId} userId={userId} />
      ))}
    </ul>
  )
}
