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
export const usePostsQuery = () =>
  useQuery<CommunityPost[]>({
    queryKey: ['community-posts'],
    queryFn: getAllPosts,
  })

// 📌 특정 게시글 상세
export const usePostDetailQuery = (postId: number) =>
  useQuery<CommunityPost>({
    queryKey: ['community-post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId, // postId가 존재할 때만 요청
  })

// 📌 게시글 작성
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ['community-post', variables.postId] })
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
