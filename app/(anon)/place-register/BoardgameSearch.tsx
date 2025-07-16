'use client'

import React, { useState } from 'react'
import styles from './BoardgameSearch.module.css'
import TextInput from '@/_components/TextInput/TextInput'

const DUMMY_GAMES = [
  '벚꽃 내리는 시대의 결투',
  '오늘은 내가 내향인',
  '내향인 클럽 보드게임',
  '깜짝 MBTI 내향인 퀴즈',
  '스플렌더',
  '카탄',
  '티켓 투 라이드',
]

interface BoardgameSearchProps {
  onSelect?: (game: string) => void
}

const BoardgameSearch: React.FC<BoardgameSearchProps> = ({ onSelect }) => {
  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1 || query === '') return text

    const before = text.slice(0, index)
    const match = text.slice(index, index + query.length)
    const after = text.slice(index + query.length)

    return (
      <>
        {before}
        <strong>{match}</strong>
        {after}
      </>
    )
  }

  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredGames = DUMMY_GAMES.filter((game) => game.includes(inputValue))
  console.log('필터링된 게임:', filteredGames)

  const handleSelect = (game: string) => {
    setInputValue(game)
    setShowDropdown(false)
    onSelect?.(game)
  }

  return (
    <div className={styles.container}>
      <TextInput
        type="text"
        placeholder="찾을 보드게임을 입력하세요"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setShowDropdown(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        className={styles.input}
      />

      {showDropdown && inputValue.trim() !== '' && filteredGames.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredGames.map((game, idx) => (
            <li key={idx} className={styles.dropdownItem} onClick={() => handleSelect(game)}>
              {highlightMatch(game, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BoardgameSearch
