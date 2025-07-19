'use client'

import PostWriteForm from '@/_components/Post/PostWrite'
import { useSearchParams } from 'next/navigation'

export default function PostWritePage() {
  const searchParams = useSearchParams()
  const postIdParam = searchParams.get('id')
  const postId = postIdParam ? Number(postIdParam) : undefined

  return <PostWriteForm postId={postId} />
}
