// ✅ 수정된 BoardgameList.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import BoardgameCard from '@/_components/BoardgameCard/BoardgameCard'
import styles from './BoardgameList.module.css'
import { getBoardgamesByStoreId } from 'models/services/boardgame.service'

interface Boardgame {
  id: number
  title: string
  imgUrl: string
}

interface BoardgameListProps {
  storeId?: string // ✅ 선택적 prop로 받되 fallback 사용
}

export default function BoardgameList({ storeId }: BoardgameListProps) {
  const [games, setGames] = useState<Boardgame[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

  // ✅ storeId 우선순위: props → query string
  const resolvedStoreId = storeId ?? searchParams.get('storeId')

  useEffect(() => {
    const fetchGames = async () => {
      if (!resolvedStoreId) {
        console.warn('storeId가 없습니다.')
        return
      }

      try {
        const res = await getBoardgamesByStoreId(resolvedStoreId)
        if (res.success) {
          setGames(res.data)
        } else {
          console.error('API 실패 응답:', res)
        }
      } catch (e) {
        console.error('보드게임 데이터를 불러오는 데 실패했어요', e)
      }
    }

    fetchGames()
  }, [resolvedStoreId])

  const top3 = games.slice(0, 3)

  const handleMoreClick = () => {
    const id = params?.id ?? resolvedStoreId
    router.push(`/store-info-gamelist?storeId=${id}`)
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
