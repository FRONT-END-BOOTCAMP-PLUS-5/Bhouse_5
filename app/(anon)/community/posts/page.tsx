'use client'

import { usePostsQuery } from 'models/querys/community.query'
import PostList from '@/_components/Post/PostList'

export default function CommunityPostsPage() {
  const { data: posts = [], isLoading } = usePostsQuery()

  if (isLoading) return <div>불러오는 중...</div>

  return (
    <div style={{ padding: '1rem', maxWidth: '768px', margin: '0 auto' }}>
      <h1>커뮤니티 게시판</h1>
      <PostList posts={posts} currentPage={1} postsPerPage={10} onPageChange={() => {}} />
    </div>
  )
}
