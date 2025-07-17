'use client'

import React, { useState } from 'react'
import styles from './BoardgameSearch.module.css'

const dummyGames = [
  '벚꽃 내리는 시대의 결투',
  '오늘은 내가 내향인',
  '내향인 클럽 보드게임',
  '깜짝 MBTI 내향인 퀴즈',
  '스플렌더',
  '카탄',
  '티켓 투 라이드',
]

export default function BoardgameSearch() {
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = dummyGames.filter((game) => game.toLowerCase().includes(inputValue.toLowerCase()))

  const handleSelect = (game: string) => {
    setSelected(game)
    setInputValue(game)
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="보드게임을 검색하세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.input}
      />

      {inputValue && filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.map((game, idx) => (
            <li key={idx} className={styles.dropdownItem} onClick={() => handleSelect(game)}>
              {game}
            </li>
          ))}
        </ul>
      )}

      {selected && <p className={styles.selectedText}>선택됨: {selected}</p>}
    </div>
  )
}
