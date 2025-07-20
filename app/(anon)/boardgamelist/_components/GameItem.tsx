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
      <span>{game.id}</span>
      <img src={game.img_url} alt={game.title} width={80} height={80} style={{ borderRadius: '8px' }} />
      <div>
        <div>{game.name}</div>
        <div style={{ fontSize: '12px', color: '#777' }}>보유 매장:</div>
      </div>
    </div>
  )
}
