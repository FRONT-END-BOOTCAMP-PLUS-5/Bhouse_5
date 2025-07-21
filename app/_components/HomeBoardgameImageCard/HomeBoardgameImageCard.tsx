import React from 'react'
import Image from 'next/image'
import Link from 'next/link' // Link 컴포넌트 import
import styles from './HomeBoardgameImageCard.module.css'

interface HomeBoardgameImageCardProps {
  imageUrl: string
  alt: string
  boardgameId: number // 새로 추가: 보드게임 ID
}

const HomeBoardgameImageCard: React.FC<HomeBoardgameImageCardProps> = ({ imageUrl, alt, boardgameId }) => {
  return (
    <Link href={`/boardgame-detail/${boardgameId}`} passHref>
      <div className={styles.imageCardContainer}>
        <Image
          src={imageUrl}
          alt={alt}
          width={100} // 이미지의 실제 크기에 따라 조절 필요
          height={100} // 이미지의 실제 크기에 따라 조절 필요
          className={styles.imageThumbnail}
        />
      </div>
    </Link>
  )
}

export default HomeBoardgameImageCard
