'use client'

import Image from 'next/image'
import styles from './BoardgameList.module.css'

const boardgames = [
  {
    id: 1,
    title: '헉, 내가 잊어진 천사족의 여왕?',
    imgUrl: '/images/arknova.jpg', // public 디렉토리에 이미지 있어야 함
  },
  {
    id: 2,
    title: '헉, 내가 잊어진 천사족의 여왕?',
    imgUrl: '/images/arknova.jpg',
  },
  {
    id: 3,
    title: '헉, 내가 잊어진 천사족의 여왕?',
    imgUrl: '/images/arknova.jpg',
  },
]

export default function BoardgameList() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.allGamesText}>소장 보드게임</span>
      </div>

      <div className={styles.list}>
        {boardgames.map((game) => (
          <div key={game.id} className={styles.item}>
            <Image src={game.imgUrl} alt={game.title} width={60} height={60} className={styles.thumbnail} />
            <span className={styles.title}>{game.title}</span>
          </div>
        ))}
      </div>

      <div className={styles.more}>
        <span>더보기</span>
      </div>
    </div>
  )
}
