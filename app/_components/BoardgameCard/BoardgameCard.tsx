import styles from './BoardgameCard.module.css'
import Image from 'next/image'

interface BoardgameCardProps {
  imageUrl: string
  title: string
  width: number
  height: number
  onClick?: () => void
}

export default function BoardgameCard({ imageUrl, title, width, height, onClick }: BoardgameCardProps) {
  return (
    <div className={styles.item} onClick={onClick}>
      <Image src={imageUrl} alt={title} className={styles.image} width={width} height={height} />
      <div className={styles.title}>{title}</div>
    </div>
  )
}
