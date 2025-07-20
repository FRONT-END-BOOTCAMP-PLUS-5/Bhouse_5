'use client'

import { useState } from 'react'
import PostList from '@/_components/Post/PostList'
import { usePostsQuery } from 'models/querys/community.query'

export default function CommunityPostsPage() {
  const { data: posts = [] } = usePostsQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  // 🔥 최신순으로 정렬 (createdAt 내림차순)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // 현재 페이지에 해당하는 post만 추출
  const indexOfLast = currentPage * postsPerPage
  const indexOfFirst = indexOfLast - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirst, indexOfLast)

  // CommunityPost를 PostList가 기대하는 Post 타입으로 변환
  const transformedPosts = currentPosts.map((post) => ({
    ...post,
    hits: post.hits ?? 0, // hits가 undefined인 경우 0으로 설정
  }))

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  return (
    <PostList
      posts={transformedPosts}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  )
}
