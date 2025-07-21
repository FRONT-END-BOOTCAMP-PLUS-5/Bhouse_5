'use client'

import { useGetBoardgameDetail, useGetStoresByBoardgameId } from 'models/querys/boardgame.query'
import styles from './BoardgameDetailClient.module.css'
import Image from 'next/image'
interface BoardgameDetailClientProps {
  id: number
}

export default function BoardgameDetailClient({ id }: BoardgameDetailClientProps) {
  const { data: boardgame, isLoading, error } = useGetBoardgameDetail(id)
  const { data: stores, isLoading: storesLoading, error: storesError } = useGetStoresByBoardgameId(id)
  console.log(stores)
  console.log(boardgame)
  if (isLoading || storesLoading) return <div>불러오는 중...</div>
  if (error || storesError) return <div>에러 발생: {(error || storesError)?.message}</div>
  if (!boardgame) return <div>보드게임 정보를 찾을 수 없습니다.</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>보드게임 상세정보</h2>

      <div className={styles.header}>
        <Image src={boardgame.img_url} alt={boardgame.name} className={styles.image} width={40} height={40} />
        <div className={styles.headerText}>
          <h3 className={styles.title}>{boardgame.name}</h3>
          <p className={styles.genre}>장르: {boardgame.genre}</p>
          <p className={styles.info}>
            {boardgame.min_players}~{boardgame.max_players}명<br />
            {boardgame.min_playtime}~{boardgame.max_playtime}분 &nbsp;|&nbsp; 난이도 : {boardgame.difficulty}
          </p>
        </div>
      </div>

      <hr className={styles.divider} />

      <h3 className={styles.sectionTitle}>게임 소개</h3>
      <p className={styles.description}>{boardgame.description}</p>

      <hr className={styles.divider} />

      <h3 className={styles.sectionTitle}>플레이 가능한 공간</h3>
      {stores?.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>공간</th>
              <th>주소</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr key={index}>
                <td>{store.storeName}</td>
                <td>{store.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>이 보드게임을 보유한 공간이 아직 없습니다.</p>
      )}
    </div>
  )
}
