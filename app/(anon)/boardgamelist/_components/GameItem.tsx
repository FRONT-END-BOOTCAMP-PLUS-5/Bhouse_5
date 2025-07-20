'use client'

import { useRouter } from 'next/navigation'
import styles from './GameItem.module.css'

interface GameItemProps {
  game: {
    id: number
    title: string
    imgUrl: string
  }
  rank: number
}

export default function GameItem({ game, rank }: GameItemProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/boardgame-detail/${game.id}`)
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.rank}>{rank}</div>
      <img src={game.img_url} alt={game.title} className={styles.thumbnail} />
      <div className={styles.info}>
        <div className={styles.title}>{game.name}</div>
        <div className={styles.store}>
          카페공룡
          <br />
          동규카페
          <br />
          동동카페
        </div>
      </div>
      <div className={styles.heart}>❤️</div>
    </div>
  )
}
