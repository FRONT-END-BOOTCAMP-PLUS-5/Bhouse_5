'use client'

import styles from './page.module.css'
import { useSearchParams, useRouter } from 'next/navigation'

const dummyCommunityPosts = [
  { id: 1, title: '보드게임 추천해주세요', preview: '가족들이랑 할만한 게임 찾고 있어요' },
  { id: 2, title: '시계탑 후기', preview: '생각보다 전략요소가 많고 재미있어요' },
  { id: 3, title: '글룸헤이븐 도전기', preview: '진입장벽은 있지만 해볼만합니다' },
]

const dummyBoardgames = [
  { id: 101, title: '시계탑에 흐른 피', imgUrl: '/images/clocktower.jpg' },
  { id: 102, title: '크리터 키친', imgUrl: '/images/critter.jpg' },
  { id: 103, title: '루트', imgUrl: '/images/root.jpg' },
]

export default function SearchResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const keyword = searchParams.get('q') || ''

  const handleMoreCommunity = () => {
    router.push(`/community/search?q=${encodeURIComponent(keyword)}`)
  }

  const handleMoreBoardgames = () => {
    router.push(`/boardgames/search?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className={styles.container}>
      <h1>검색 결과: &quot;{keyword}&quot;</h1>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>📌 커뮤니티 게시글</h2>
          <button className={styles.moreBtn} onClick={handleMoreCommunity}>
            더보기
          </button>
        </div>
        {dummyCommunityPosts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.title}>{post.title}</div>
            <div className={styles.preview}>{post.preview}</div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🎲 보드게임</h2>
          <button className={styles.moreBtn} onClick={handleMoreBoardgames}>
            더보기
          </button>
        </div>
        <div className={styles.games}>
          {dummyBoardgames.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <img src={game.imgUrl} alt={game.title} className={styles.thumbnail} />
              <div className={styles.gameTitle}>{game.title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
