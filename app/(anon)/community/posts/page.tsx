// app/community/posts/page.tsx
'use client'

import { useEffect, useState } from 'react'
import PostList from '@/_components/Post/PostList'

interface Post {
  postId: number
  title: string
  commentCount?: number
  town: string
  nickname: string
  createdAt: string
  isNotice?: boolean
}

export default function CommunityPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/community/posts', { cache: 'no-store' })
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.error('게시글 불러오기 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) return <div>불러오는 중...</div>

  return (
    <div style={{ padding: '1rem' }}>
      <h1>커뮤니티 게시판</h1>
      <PostList posts={posts} currentPage={currentPage} postsPerPage={postsPerPage} onPageChange={setCurrentPage} />
    </div>
  )
}
