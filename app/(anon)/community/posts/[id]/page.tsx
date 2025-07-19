import PostDetailPage from '@/_components/Post/PostDetail'

export default async function CommunityPostPage({ params }: { params: { id: string } }) {
  const postId = params.id

  const postRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/community/posts/${postId}`, {
    cache: 'no-store',
  })
  const post = await postRes.json()

  return <PostDetailPage post={post} />
}
