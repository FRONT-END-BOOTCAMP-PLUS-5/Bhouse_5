// _components/BoardgameImageCard/BoardgameImageCard.tsx
import React from 'react'
import Image from 'next/image'
import styles from './BoardgameImageCard.module.css' // 이 파일도 새로 생성합니다.

interface BoardgameImageCardProps {
  imageUrl: string
  alt: string
}

const BoardgameImageCard: React.FC<BoardgameImageCardProps> = ({ imageUrl, alt }) => {
  return (
    <div className={styles.imageCardContainer}>
      <Image
        src={imageUrl}
        alt={alt}
        width={100} // 이미지의 실제 크기에 따라 조절 필요
        height={100} // 이미지의 실제 크기에 따라 조절 필요
        className={styles.imageThumbnail}
      />
    </div>
  )
}

export default BoardgameImageCard
