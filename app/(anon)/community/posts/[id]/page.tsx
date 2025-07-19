'use client'

import PostDetailPage from '@/_components/Post/PostDetail'

export default function CommunityPostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id)

  return <PostDetailPage postId={postId} />
}
