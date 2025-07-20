// models/services/myactivity.service.ts

import instance from '@utils/instance'

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

const POSTS_PATH = '/api/user/activity/posts'
const REPLIES_PATH = '/api/user/activity/replies'

/**
 * 사용자 게시글 목록을 가져오는 서비스 함수
 * @returns MyPostResponseItem 배열
 */
export const getMyPostsService = async (): Promise<ApiResponse<MyPostResponseItem[]>> => {
  try {
    const res = await instance.get<ApiResponse<MyPostResponseItem[]>>(POSTS_PATH)
    console.log('내 게시글 응답:', res.data)
    return res.data
  } catch (error) {
    console.error('내 게시글 조회 실패:', error)
    throw error
  }
}

/**
 * 사용자 댓글 목록을 가져오는 서비스 함수
 * @returns MyReplyResponseItem 배열
 */
export const getMyRepliesService = async (): Promise<ApiResponse<MyReplyResponseItem[]>> => {
  try {
    const res = await instance.get<ApiResponse<MyReplyResponseItem[]>>(REPLIES_PATH)
    console.log('내 덧글 응답:', res.data)
    return res.data
  } catch (error) {
    console.error('내 덧글 조회 실패:', error)
    throw error
  }
}
