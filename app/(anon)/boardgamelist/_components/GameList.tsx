'use client'

import { useGetBoardgameList } from 'models/querys/boardgame.query'
import GameItem from './GameItem'

export default function GameList() {
  const { data: boardgames = [], isLoading, error } = useGetBoardgameList()
  console.log('GameList에서 보낸 boardgames:', boardgames)
  if (isLoading) return <div>불러오는 중...</div>
  if (error) return <div>에러 발생: {(error as Error).message}</div>

  if (!boardgames || boardgames.length === 0) return <div>데이터 없음</div>
  console.log('GameList에서 보낸 boardgames:', boardgames)
  const top3 = boardgames.slice(0, 3)

  return (
    <>
      {top3.map((game: { id: any; title?: string; imgUrl?: string }, i: number) => (
        <GameItem key={game.id} game={game} rank={i + 1} />
      ))}
    </>
  )
}
