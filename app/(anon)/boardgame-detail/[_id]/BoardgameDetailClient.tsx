'use client'

import { useGetBoardgameDetail } from 'models/querys/boardgame.query'
import styles from './BoardgameDetailClient.module.css'

interface BoardgameDetailClientProps {
  id: number
}

export default function BoardgameDetailClient({ id }: BoardgameDetailClientProps) {
  console.log('BoardgameDetailClient에서 가져온 id:', id)
  console.log(useGetBoardgameDetail(id))
  const { data: boardgame, isLoading, error } = useGetBoardgameDetail(id)
  if (isLoading) return <div>불러오는 중...</div>
  if (error) return <div>에러 발생: {error.message}</div>
  if (!boardgame) return <div>보드게임 정보를 찾을 수 없습니다.</div>

  console.log('boardgames:', boardgame)
  return (
    <div className={styles.container}>
      <h2>보드게임 상세정보</h2>
      {/* <img src={boardgame.imageUrl} alt={boardgame.name} className={styles.image} /> */}
      <h3 className={styles.title}>{boardgame.name}</h3>
      <p className={styles.genre}>장르: {boardgame.genre}</p>
      <p className={styles.info}>
        {boardgame.min_players} ~ {boardgame.max_players}
        <br />
        {boardgame.min_playtime} ~ {boardgame.max_playtime}
        <br />
        난이도 : {boardgame.difficulty}
      </p>

      <hr />

      <h3>게임 소개</h3>
      <p className={styles.description}>{boardgame.description}</p>

      <hr />

      <h3>공간 정보</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>공간</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          {boardgame.stores?.map((store, index) => (
            <tr key={index}>
              <td>{store.name}</td>
              <td>{store.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
