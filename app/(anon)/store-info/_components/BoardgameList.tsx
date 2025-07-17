'use client'

import Image from 'next/image'
import styles from './BoardgameList.module.css'
import BoardgameCard from '@/_components/BoardgameCard/BoardgameCard'

const games = [
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
    <div>
      <div>
        {games.map((game: { imgUrl: any; title: any }, index: any) => (
          <BoardgameCard key={index} imageUrl={game.imgUrl} title={game.title} width={40} height={40} />
        ))}
      </div>
      <div style={{ textAlign: 'right', fontSize: '13px', color: '#007bff', marginTop: '8px', paddingRight: '12px' }}>
        더보기
      </div>
    </div>
  )
}
