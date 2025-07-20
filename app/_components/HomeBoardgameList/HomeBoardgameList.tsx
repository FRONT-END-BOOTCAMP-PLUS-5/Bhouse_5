// BoardgameList.tsx
'use client'

import React from 'react'
import styles from './BoardgameList.module.css'
import HomeBoardgameImageCard from '../HomeBoardgameImageCard/HomeBoardgameImageCard'
import { useGetBoardgameList } from 'models/querys/boardgame.query' // BoardgameSearch.tsx에 맞춰 'querys'로 import 경로 일치

// API 응답에 like_count가 포함된다는 사용자님의 최신 정보를 반영합니다.
interface BoardgameItem {
  id: number
  name: string
  min_players: number
  max_players: number
  img_url: string
  like_count: number // 사용자님 확인에 따라 like_count 필드를 다시 포함합니다.
}

export default function HomeBoardgameList() {
  // useGetBoardgameList 훅을 사용하여 보드게임 데이터 가져오기
  // data를 fetchedData로 받고, 로딩/에러 상태와 함께 가져옵니다.
  const { data: fetchedData, isLoading, isError, error } = useGetBoardgameList('')

  // fetchedData가 실제로 배열인지 확인하고, 배열이 아니거나 비어있으면 빈 배열로 처리합니다.
  // 이 부분이 데이터가 넘어오지 않는 것처럼 보이는 핵심적인 원인일 수 있습니다.
  const boardgames: BoardgameItem[] = Array.isArray(fetchedData) ? (fetchedData as BoardgameItem[]) : []

  // === 디버깅을 위한 상세 로그 추가 ===
  console.log('--- BoardgameList 컴포넌트 렌더링 시작 ---')
  console.log('  isLoading 상태:', isLoading)
  console.log('  isError 상태:', isError)
  console.log('  에러 객체 (있다면):', error)
  console.log('  useGetBoardgameList로부터 받은 raw data (fetchedData):', fetchedData)
  console.log('  Array.isArray(fetchedData) 결과:', Array.isArray(fetchedData))
  console.log('  최종 처리된 boardgames 배열:', boardgames)
  console.log('  boardgames.length (최종 처리 후):', boardgames.length)
  console.log('------------------------------------')
  // ====================================

  // 로딩 상태 처리
  if (isLoading) {
    return <div className={styles.container}>로딩 중입니다...</div>
  }

  // 에러 상태 처리
  if (isError) {
    return <div className={styles.container}>데이터를 불러오는데 실패했습니다: {error?.message}</div>
  }

  // boardgames가 여전히 비어있다면, 데이터를 받지 못했거나 받은 데이터가 비어있다는 뜻입니다.
  // 위의 상세 로그를 통해 이 시점에 boardgames.length가 왜 0인지 파악해야 합니다.
  if (boardgames.length === 0) {
    console.log('BoardgameList: 최종적으로 표시할 보드게임이 없습니다. (boardgames.length가 0)')
    return <div className={styles.container}>등록된 보드게임이 없습니다.</div>
  }

  // like_count가 많은 순으로 정렬하고 상위 6개만 선택
  // 사용자님의 확인에 따라 like_count로 다시 정렬합니다.
  const top6Boardgames = [...boardgames].sort((a, b) => b.like_count - a.like_count).slice(0, 6)

  console.log('BoardgameList: 표시할 상위 6개 보드게임 (정렬 및 슬라이스 후):', top6Boardgames) // 최종 데이터 확인

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.titleText}>지금 HOT한 보드게임</h2>
        <span className={styles.allGamesText}>더보기</span>
      </div>

      <div className={styles.listGrid}>
        {top6Boardgames.map((game) => (
          <HomeBoardgameImageCard key={game.id} imageUrl={game.img_url} alt={game.name} />
        ))}
      </div>
    </div>
  )
}
