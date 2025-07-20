'use client'

import { useState } from 'react'
import { Reply } from '../../../types/reply'
import ChildReplyForm from './ChildReplyForm'
import styles from './ReplyList.module.css'

interface Props {
  reply: Reply
  replies: Reply[]
  postId: number
  userId: string
  depth?: number
}

export default function RecursiveReplyItem({ reply, replies, postId, userId, depth = 0 }: Props) {
  const [isReplying, setIsReplying] = useState(false)

  const toggleReply = () => setIsReplying((prev) => !prev)

  const childReplies = replies.filter((r) => r.parentReplyId === reply.replyId)

  return (
    <li
      key={reply.replyId}
      className={styles.replyItem}
      style={{
        marginLeft: depth === 1 ? '1rem' : '0', // 답글만 들여쓰기
      }}
    >
      <div className={styles.replyContent}>
        <span className={styles.nickname}>{reply.users?.nickname ?? '알 수 없음'}</span>
        <p className={styles.text}>{reply.content}</p>
      </div>

      <button className={styles.replyToggleBtn} onClick={toggleReply}>
        {isReplying ? '답글 닫기' : '답글 쓰기'}
      </button>

      {isReplying && (
        <div className={styles.replyFormWrapper}>
          <ChildReplyForm postId={postId} parentReplyId={reply.replyId} userId={userId} />
        </div>
      )}

      {childReplies.map((child) => (
        <RecursiveReplyItem
          key={child.replyId}
          reply={child}
          replies={replies}
          postId={postId}
          userId={userId}
          depth={depth + 1}
        />
      ))}
    </li>
  )
}
