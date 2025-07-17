'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BoardgameCard from '@/_components/BoardgameCard/BoardgameCard'
import styles from './BoardgameList.module.css'
import { getBoardgamesByStoreId } from 'models/services/boardgame.service'

interface Boardgame {
  id: number
  title: string
  imgUrl: string
}

export default function BoardgameList() {
  const [games, setGames] = useState<Boardgame[]>([])
  const storeId = 2
  const router = useRouter()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await getBoardgamesByStoreId(storeId)
        if (res.success) {
          setGames(res.data)
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchGames()
  }, [])

  const top3 = games.slice(0, 3)

  const handleMoreClick = () => {
    router.push(`/store-info-gamelist?storeId=${storeId}`)
  }

  return (
    <div>
      <div className={styles.cardList}>
        {top3.map((game, index) => (
          <BoardgameCard key={index} imageUrl={game.imgUrl} title={game.title} width={60} height={60} />
        ))}
      </div>

      {games.length > 3 && <div onClick={handleMoreClick}>더보기</div>}
    </div>
  )
}
