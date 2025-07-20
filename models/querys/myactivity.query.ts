// queries/myactivity.query.ts

import { getMyPostsService, getMyRepliesService } from 'models/services/myactivity.service'

// 서비스 함수들의 응답 타입을 직접 정의하거나, 서비스 파일에서 임포트하여 사용
interface MyPostResponseItem {
  id: number
  title: string
  hits: number
  category: string
  createdAt: string // ISO 8601 string
}

interface MyReplyResponseItem {
  reply_id: number
  post_id: number
  text: string
  parent_reply_id: number | null
  created_at: string // ISO 8601 string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  total?: number
}

/**
 * 사용자 게시글 데이터를 가져오는 쿼리 함수 (React Query의 queryFn에 사용)
 * @returns Promise<ApiResponse<MyPostResponseItem[]>>
 */
export const fetchMyPostsData = (): Promise<ApiResponse<MyPostResponseItem[]>> => {
  return getMyPostsService()
}

/**
 * 사용자 댓글 데이터를 가져오는 쿼리 함수 (React Query의 queryFn에 사용)
 * @returns Promise<ApiResponse<MyReplyResponseItem[]>>
 */
export const fetchMyRepliesData = (): Promise<ApiResponse<MyReplyResponseItem[]>> => {
  return getMyRepliesService()
}
