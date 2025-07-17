'use client'

import Divider from '@/_components/Divider/Divider'
import styles from './page.module.css'
import StoreInfo from './_components/StoreInfo'
import BoardgameList from './_components/BoardgameList'

export default function PlaceInfoPage() {
  return (
    <div className={styles.container}>
      <h1>보드게임모여라!`매장이름`</h1>
      <Divider />
      <div className="carousel">캐로샐구역</div>
      <StoreInfo />
      <Divider />
      <BoardgameList />
      <Divider />
      {/* <StorePosition/> */}
    </div>
  )
}
