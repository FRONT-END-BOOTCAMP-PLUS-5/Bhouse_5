'use client'

import { useState } from 'react'
import styles from '../page.module.css'
import ListingElement from '@/_components/ListingElement/ListingElement'
import BoardgameSearch from './BoardgameSearch'

export default function BoardgameListForm() {
  const [selectedGames, setSelectedGames] = useState<string[]>([])

  const handleSelectGame = (game: string) => {
    if (!selectedGames.includes(game)) {
      setSelectedGames((prev) => [...prev, game])
    }
  }

  const handleDeleteGame = (gameToDelete: string) => {
    setSelectedGames((prev) => prev.filter((game) => game !== gameToDelete))
  }

  return (
    <form className={styles.boardgameListForm}>
      <BoardgameSearch onSelect={handleSelectGame} />

      <div className={styles.boardgameList}>
        <ul className={styles.boardgameItems}>
          {selectedGames.map((game, idx) => (
            <li key={idx}>
              <ListingElement label={game} onDelete={() => handleDeleteGame(game)} />
            </li>
          ))}
        </ul>
      </div>
    </form>
  )
}
