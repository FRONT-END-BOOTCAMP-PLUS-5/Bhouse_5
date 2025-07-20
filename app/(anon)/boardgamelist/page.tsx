'use client'

import Divider from '@/_components/Divider/Divider'
import GameList from './_components/GameList'
import styles from './page.module.css'

export default function BoardgameList() {
  return (
    <div className={styles.container}>
      <h2>보드게임 리스트</h2>
      <div className={styles.category}>전체/전략/추상/가족</div>
      <Divider />
      <div className="header">순위 게임 공감 찜</div>
      <GameList />
    </div>
  )
}
