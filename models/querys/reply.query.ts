import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Reply } from '../../types/reply'
import instance from '@utils/instance'

// ✅ 댓글 목록 조회
export function useReplies(postId: number) {
  return useQuery<Reply[]>({
    queryKey: ['replies', postId],
    queryFn: async (): Promise<Reply[]> => {
      try {
        const res = await instance.get<Reply[]>(`/api/community/replies`, {
          params: { postId },
        })
        return res.data
      } catch (err) {
        console.error('[댓글 불러오기 실패]', err)
        throw new Error('댓글 목록 불러오기 실패')
      }
    },
  })
}

// ✅ 일반 댓글 작성
export function useCreateReply(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, content }: { userId: string; content: string }) => {
      const res = await instance.post('/api/community/replies', {
        postId,
        userId,
        content,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', postId] })
    },
  })
}

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
      const res = await instance.post('/api/community/replies', {
        postId,
        userId,
        content,
        parentReplyId,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', postId] })
    },
  })
}

// 댓글 수정
export function useUpdateReply(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ replyId, userId, content }: { replyId: number; userId: string; content: string }) => {
      const res = await instance.patch(`/api/community/replies/${replyId}`, {
        userId,
        content,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', postId] })
    },
  })
}

// 댓글 삭제
export function useDeleteReply(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ replyId, userId }: { replyId: number; userId: string }) => {
      const res = await instance.delete(`/api/community/replies/${replyId}`, {
        data: { userId }, // ⚠️ axios로 보낼 때는 data 필드에 담아야 함
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', postId] })
    },
  })
}
