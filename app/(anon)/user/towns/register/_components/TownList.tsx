'use client'

import styles from '../TownRegister.module.css'

interface TownInfo {
  name: string
  isPrimary: boolean
}

interface TownListProps {
  townList: TownInfo[]
  onSetPrimary: (townName: string) => void
  onDelete: (townName: string) => void
}

export default function TownList({ townList, onSetPrimary, onDelete }: TownListProps) {
  return (
    <>
      <h3>📌 등록된 내 동네</h3>
      {townList.length === 0 ? (
        <p>아직 등록된 동네가 없습니다.</p>
      ) : (
        <ul>
          {townList.map((town) => (
            <li key={town.name} className={styles.townItem}>
              <span className={styles.townName}>
                {town.name}
                {town.isPrimary && <span className={styles.primaryTag}>(대표)</span>}
              </span>
              <div className={styles.buttonGroup}>
                <button onClick={() => onSetPrimary(town.name)}>대표로 설정</button>
                <button onClick={() => onDelete(town.name)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
