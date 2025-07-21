'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BoardgameCard from '@/_components/BoardgameCard/BoardgameCard'
import { getBoardgamesByStoreId } from 'models/services/boardgame.service'
import styles from './page.module.css'
import Pagination from './_components/Pagination'

interface Boardgame {
  id: number
  title: string
  imgUrl: string
}

const ITEMS_PER_PAGE = 10

export default function StoreGameListPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get('storeId')
  const page = Number(searchParams.get('page')) || 1

  const [games, setGames] = useState<Boardgame[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)

  useEffect(() => {
    const fetchGames = async () => {
      if (!storeId) return
      try {
        const res = await getBoardgamesByStoreId(Number(storeId))
        if (res.success) {
          setTotalCount(res.data.length)
          const start = (page - 1) * ITEMS_PER_PAGE
          const end = start + ITEMS_PER_PAGE
          setGames(res.data.slice(start, end))
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchGames()
  }, [storeId, page])

  return (
    <div>
      <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>매장 소장 보드게임</h2>
      <div className={styles.cardList}>
        {games.map((game) => (
          <BoardgameCard key={game.id} imageUrl={game.imgUrl} title={game.title} width={60} height={60} />
        ))}
      </div>

      <Pagination currentPage={page} totalCount={totalCount} />
    </div>
  )
}
