'use client'

import { useState } from 'react'
import { Reply } from '../../../types/reply'
import ChildReplyForm from './ChildReplyForm'
import styles from './ReplyList.module.css'
import { useUpdateReply, useDeleteReply } from 'models/querys/reply.query'
import TextInput from '../TextInput/TextInput'

interface RecursiveReplyItemProps {
  reply: Reply
  replies: Reply[]
  postId: number
  userId: string
  depth?: number
}

export default function RecursiveReplyItem({ reply, replies, postId, userId, depth = 0 }: RecursiveReplyItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)

  const updateMutation = useUpdateReply(postId)
  const deleteMutation = useDeleteReply(postId)

  const childReplies = replies.filter((r) => r.parentReplyId === reply.replyId)
  const isMine = reply.userId === userId

  const toggleReplyForm = () => setIsReplying((prev) => !prev)
  const toggleEditForm = () => setIsEditing((prev) => !prev)

  const handleUpdate = () => {
    if (!editContent.trim()) return
    updateMutation.mutate({ replyId: reply.replyId, userId, content: editContent })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      deleteMutation.mutate({ replyId: reply.replyId, userId })
    }
  }

  return (
    <li
      className={`${styles.replyItem} ${depth === 1 ? styles.childReply : ''}`}
      style={{ marginLeft: depth > 1 ? 0 : undefined }}
    >
      <div className={styles.replyContent}>
        <span className={styles.nickname}>{reply.users?.nickname ?? '알 수 없음'}</span>

        {/* ✅ 수정 중이면 textarea, 아니면 일반 텍스트 */}
        {isEditing ? (
          <div className={styles.editWrapper}>
            <TextInput
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.editTextarea}
              placeholder="댓글을 수정하세요..."
              rows={3}
            />
            <div className={styles.editActions}>
              <button onClick={handleUpdate} className={styles.saveButton}>
                💾 저장
              </button>
              <button onClick={toggleEditForm} className={styles.cancelButton}>
                ❌ 취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.text}>{reply.content}</p>

            {isMine && (
              <div className={styles.actions}>
                <button onClick={toggleEditForm} className={styles.editBtn}>
                  수정
                </button>
                <button onClick={handleDelete} className={styles.deleteBtn}>
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ 답글 쓰기 버튼 */}
      {depth < 2 && !isEditing && (
        <button className={styles.replyToggleBtn} onClick={toggleReplyForm}>
          {isReplying ? '답글 닫기' : '답글 쓰기'}
        </button>
      )}

      {/* ✅ 답글 폼 */}
      {isReplying && (
        <div className={styles.replyFormWrapper}>
          <ChildReplyForm postId={postId} parentReplyId={reply.replyId} userId={userId} />
        </div>
      )}

      {/* ✅ 재귀적으로 자식 댓글 렌더링 */}
      {childReplies.length > 0 && (
        <ul className={styles.replyList}>
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
        </ul>
      )}
    </li>
  )
}
