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

export const getAllPosts = async (
  categoryId: number | null,
  townName: string | null,
  isLoggedIn: boolean,
  tab?: { id: number; label: string }, // ← '모집'일 때만 townName, isLoggedIn 사용
): Promise<CommunityPost[]> => {
  const params = new URLSearchParams()
  console.log('🚀 [getAllPosts] called with:')
  console.log('  categoryId:', categoryId)
  console.log('  townName:', townName) // ✅ 여기 확인!
  console.log('  isLoggedIn:', isLoggedIn)
  console.log('  tab:', tab)

  if (categoryId !== null) params.append('categoryId', String(categoryId))
  params.append('isLoggedIn', String(isLoggedIn))

  if (tab?.id === 1 || tab?.id === '1') {
    if (townName !== null) {
      params.append('townName', townName)
    }
  }
  const query = params.toString() ? `?${params.toString()}` : ''
  console.log('🌐 Final API URL:', `/api/community/posts${query}`)

  const res = await instance.get(`/api/community/posts${query}`)
  // 🔥 게시글 목록 출력
  console.log('📦 [getAllPosts] Fetched posts:', res.data)
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
