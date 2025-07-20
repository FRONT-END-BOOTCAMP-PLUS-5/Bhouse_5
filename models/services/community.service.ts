import instance from '@utils/instance'

export interface CommunityPost {
  profileImgUrl: string
  userId: any
  postId: number
  title: string
  content: string
  hits?: number
  town: string
  nickname: string
  createdAt: string
  isNotice?: boolean
}

export interface CreatePostPayload {
  userId: string
  title: string
  content: string
  categoryId: number
}

export interface UpdatePostPayload {
  postId: number
  userId: string
  title: string
  content: string
  categoryId: number
}

export const getAllPosts = async (): Promise<CommunityPost[]> => {
  const res = await instance.get('/api/community/posts')
  return res.data as CommunityPost[]
}

export const getPostById = async (postId: number): Promise<CommunityPost> => {
  const res = await instance.get(`/api/community/posts/${postId}`)
  return res.data as CommunityPost
}

export const createPost = async (payload: CreatePostPayload): Promise<void> => {
  await instance.post('/api/community/posts', payload)
}

export const updatePost = async (payload: UpdatePostPayload): Promise<void> => {
  await instance.patch(`/api/community/posts/${payload.postId}`, payload)
}

export const deletePost = async (postId: number): Promise<void> => {
  await instance.delete(`/api/community/posts/${postId}`)
}
