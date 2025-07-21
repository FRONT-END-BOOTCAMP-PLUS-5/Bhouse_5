'use client'

import React from 'react'
import styles from './HomeBoardgameList.module.css'
import HomeBoardgameImageCard from '../HomeBoardgameImageCard/HomeBoardgameImageCard' // HomeBoardgameImageCard로 이름 변경
import { useGetBoardgameList } from 'models/querys/boardgame.query'

interface BoardgameItem {
  id: number
  name: string
  min_players: number
  max_players: number
  img_url: string
  like_count: number
}

export default function HomeBoardgameList() {
  const { data: fetchedData, isLoading, isError, error } = useGetBoardgameList('')

  const boardgames: BoardgameItem[] = Array.isArray(fetchedData) ? (fetchedData as BoardgameItem[]) : []

  console.log('--- BoardgameList 컴포넌트 렌더링 시작 ---')
  console.log('  isLoading 상태:', isLoading)
  console.log('  isError 상태:', isError)
  console.log('  에러 객체 (있다면):', error)
  console.log('  useGetBoardgameList로부터 받은 raw data (fetchedData):', fetchedData)
  console.log('  Array.isArray(fetchedData) 결과:', Array.isArray(fetchedData))
  console.log('  최종 처리된 boardgames 배열:', boardgames)
  console.log('  boardgames.length (최종 처리 후):', boardgames.length)
  console.log('------------------------------------')

  if (isLoading) {
    return <div className={styles.container}>로딩 중입니다...</div>
  }

  if (isError) {
    return <div className={styles.container}>데이터를 불러오는데 실패했습니다: {error?.message}</div>
  }

  if (boardgames.length === 0) {
    console.log('BoardgameList: 최종적으로 표시할 보드게임이 없습니다. (boardgames.length가 0)')
    return <div className={styles.container}>등록된 보드게임이 없습니다.</div>
  }

  const top6Boardgames = [...boardgames].sort((a, b) => b.like_count - a.like_count).slice(0, 6)

  console.log('BoardgameList: 표시할 상위 6개 보드게임 (정렬 및 슬라이스 후):', top6Boardgames)

  return (
    <div className={styles.container}>
      <div className={styles.listGrid}>
        {top6Boardgames.map((game) => (
          // key와 함께 boardgameId를 HomeBoardgameImageCard에 전달합니다.
          <HomeBoardgameImageCard
            key={game.id}
            imageUrl={game.img_url}
            alt={game.name}
            boardgameId={game.id} // 여기에서 id를 전달
          />
        ))}
      </div>
    </div>
  )
}
