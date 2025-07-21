'use client'

import React, { useState, useEffect, use } from 'react'
import styles from './BoardgameSearch.module.css'
import TextInput from '@/_components/TextInput/TextInput'
import { useGetBoardgameList } from 'models/querys/boardgame.query'

interface Boardgame {
  id: number
  name: string
  min_players: number
  max_players: number
  img_url: string
}

interface BoardgameSearchProps {
  onSelect?: (game: string) => void
  className?: string
  onSelectGame?: (id: number) => void
  placeholder?: string
}

const BoardgameSearch: React.FC<BoardgameSearchProps> = ({ onSelect, className, placeholder, onSelectGame }) => {
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

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

  const { data: boardgames = [] } = useGetBoardgameList(inputValue)
  console.log('Boardgames:', boardgames)

  const filterdBoardgames = Array.isArray(boardgames)
    ? boardgames.filter((game: Boardgame) => {
        return game.name.toLowerCase().includes(inputValue.toLowerCase())
      })
    : []

  console.log('Filtered Boardgames:', filterdBoardgames)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmed = inputValue.trim().toLowerCase()

      if (trimmed === '') {
        setSearchResults([])
        return
      }

      const boardgameArray: Boardgame[] = Array.isArray(boardgames) ? boardgames : []
      const matched = boardgameArray
        .filter((game) => game.name.toLowerCase().includes(trimmed))
        .map((game) => game.name)

      setSearchResults(matched)
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [inputValue, boardgames])

  const handleSelect = (game: string) => {
    setInputValue(game)
    setShowDropdown(false)
    onSelect?.(game)
    const found = boardgames.find((g: Boardgame) => g.name === game)
    if (found) {
      onSelectGame?.(found.id) // ✅ 부모 컴포넌트에게 ID 전달
    }
  }

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <TextInput
        type="text"
        placeholder={placeholder ?? '보드게임을 입력하세요'}
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

      {showDropdown && inputValue.trim() !== '' && (
        <ul className={styles.dropdown}>
          {loading && <li className={styles.dropdownItem}>검색 중...</li>}

          {!loading &&
            searchResults.map((game, idx) => (
              <li key={idx} className={styles.dropdownItem} onClick={() => handleSelect(game)}>
                {highlightMatch(game, inputValue)}
              </li>
            ))}

          {!loading && searchResults.length === 0 && <li className={styles.dropdownItem}>검색 결과 없음</li>}
        </ul>
      )}
    </div>
  )
}

export default BoardgameSearch
