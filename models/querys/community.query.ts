import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  CommunityPost,
  CreatePostPayload,
  UpdatePostPayload,
} from 'models/services/community.service'

// 📌 전체 게시글 목록
export const usePostsQuery = (
  categoryId: number | null,
  townName: string | null,
  isLoggedIn: boolean,
  tab: { id: number; label: string }, // ← tab도 매개변수로 받도록 수정
) =>
  useQuery<CommunityPost[]>({
    queryKey: ['community-posts', categoryId, townName, isLoggedIn, tab?.id],
    queryFn: () => getAllPosts(categoryId, townName, isLoggedIn, tab), // ← tab 전달
  })

// 📌 특정 게시글 상세
export const usePostDetailQuery = (postId: number, options?: { enabled?: boolean }) =>
  useQuery<CommunityPost>({
    queryKey: ['community-posts', postId],
    queryFn: () => getPostById(postId),
    enabled: options?.enabled ?? true, // 옵션이 없으면 기본값 true
  })

// 📌 게시글 작성
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })
}

// 📌 게시글 수정
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => updatePost(payload),
    onSuccess: (_data, variables) => {
      // 수정된 상세 캐시, 전체 목록 모두 무효화
      queryClient.invalidateQueries({ queryKey: ['community-posts', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })
}

// 📌 게시글 삭제
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })
}
