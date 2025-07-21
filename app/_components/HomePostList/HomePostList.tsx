// _components/Post/PostList.tsx
import Link from 'next/link'
import { usePostsQuery } from 'models/querys/community.query'
import styles from './HomePostList.module.css' // CSS 모듈 임포트

export default function HomePostList() {
  const selectedCategoryId = null // 또는 실제 categoryId 값
  const userTown = '' // 실제 유저 동네 값
  const isLoggedIn = false // 실제 로그인 여부
  const selectedTab = { id: 0, label: '전체' } // 실제 탭 값

  const {
    data: posts = [],
    isLoading,
    isError,
  } = usePostsQuery(selectedCategoryId, isLoggedIn ? userTown : null, isLoggedIn, selectedTab)

  if (isLoading) {
    return <div className={styles.loading}>게시글을 불러오는 중입니다...</div>
  }

  if (isError) {
    return <div className={styles.error}>게시글을 불러오는데 오류가 발생했습니다.</div>
  }

  // 최신순으로 정렬 (createdAt 내림차순) 및 상위 5개 게시글만 추출
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) // 최신 게시글 5개만

  return (
    <div className={styles.container}>
      {latestPosts.length > 0 ? (
        <ul>
          {latestPosts.map((post) => (
            <li key={post.postId} className={styles.postItem}>
              <Link href={`/community/posts/${post.postId}`} className={styles.postLink}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.noPosts}>게시글이 없습니다.</div>
      )}
    </div>
  )
}
