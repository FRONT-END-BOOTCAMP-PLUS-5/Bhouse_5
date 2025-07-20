import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Reply } from '../../types/reply'

// ✅ 댓글 목록 조회
export function useReplies(postId: number) {
  return useQuery<Reply[]>({
    queryKey: ['replies', postId],
    queryFn: async () => {
      const res = await fetch(`/api/community/replies?postId=${postId}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('댓글 목록 불러오기 실패')
      return res.json()
    },
  })
}

// ✅ 일반 댓글 작성
export function useCreateReply(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, content }: { userId: string; content: string }) => {
      const res = await fetch('/api/community/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId, content }),
      })
      if (!res.ok) throw new Error('댓글 등록 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', postId] })
    },
  })
}

// ✅ 대댓글 작성
export function useCreateChildReply(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      content,
      parentReplyId,
    }: {
      userId: string
      content: string
      parentReplyId: number
    }) => {
      const res = await fetch('/api/community/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId, content, parentReplyId }),
      })
      if (!res.ok) throw new Error('대댓글 등록 실패')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', postId] })
    },
  })
}
