'use client'

import { useGetStoreById } from 'models/querys/store.query'
import Divider from '@/_components/Divider/Divider'
import styles from './PlaceDetailClient.module.css'
import StoreInfo from '../_components/StoreInfo'
import BoardgameList from '../_components/BoardgameList'

interface Props {
  storeId: number
}

export default function PlaceDetailClient({ storeId }: Props) {
  const { data: store, isLoading, error } = useGetStoreById(storeId)

  if (isLoading) return <div className={styles.loading}>불러오는 중...</div>
  if (error) return <div className={styles.error}>에러 발생: {error.message}</div>
  if (!store) return <div className={styles.empty}>스토어 정보를 불러올 수 없습니다.</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{store.name}</h1>

      <div className={styles.carousel}>
        <img src={store.imagePlaceUrl} alt={`${store.name} 매장 이미지`} className={styles.image} />
      </div>

      <StoreInfo
        name={store.name}
        address={store.address}
        phone={store.phone}
        openTime={store.openTime}
        description={store.description}
        imagePlaceUrl={store.imagePlaceUrl}
        imageMenuUrl={store.imageMenuUrl}
        ownerName={store.ownerName}
      />

      <Divider />
      <BoardgameList />
      <Divider />
    </div>
  )
}
