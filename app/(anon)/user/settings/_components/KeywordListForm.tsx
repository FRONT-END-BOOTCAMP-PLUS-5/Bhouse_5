// src/components/KeywordListForm/KeywordListForm.tsx
'use client'

import React, { useState } from 'react'
import styles from './KeywordListForm.module.css' // 컴포넌트 전용 CSS 모듈
import TextInput from '@/_components/TextInput/TextInput' // TextInput 컴포넌트 경로
import Button from '@/_components/Button/Button' // Button 컴포넌트 경로
import ListingElement from '@/_components/ListingElement/ListingElement' // ListingElement 컴포넌트 경로

const KeywordListForm: React.FC = () => {
  const [newKeyword, setNewKeyword] = useState<string>('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    '마피아',
    '모집',
    '대방동',
    '중고거래',
    '이사 정리',
    '헐값',
    'ㅁㅍㅇ',
    '내향인 클럽',
  ]) // 더미 키워드 목록

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault() // 폼 제출 시 페이지 새로고침 방지
    if (newKeyword.trim() !== '' && !selectedKeywords.includes(newKeyword.trim())) {
      setSelectedKeywords((prev) => [...prev, newKeyword.trim()])
      setNewKeyword('') // 입력 필드 초기화
      console.log(`키워드 추가: ${newKeyword.trim()}`)
      // TODO: API 호출하여 서버에 키워드 추가
    }
  }

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setSelectedKeywords((prev) => prev.filter((keyword) => keyword !== keywordToDelete))
    console.log(`키워드 삭제: ${keywordToDelete}`)
    // TODO: API 호출하여 서버에 키워드 삭제
  }

  return (
    <div className={styles.keywordListFormContainer}>
      <form onSubmit={handleAddKeyword} className={styles.keywordInputSection}>
        <TextInput
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="게시글 알림 받을 키워드 추가하기"
          className={styles.keywordInput}
        />
        <Button type="submit" variant="primary" size="small" borderRadius="8">
          등록
        </Button>
      </form>

      <div className={styles.keywordList}>
        <ul className={styles.keywordItems}>
          {selectedKeywords.length === 0 ? (
            <li className={styles.noKeywords}>등록된 키워드가 없습니다.</li>
          ) : (
            selectedKeywords.map((keyword, idx) => (
              <li key={idx} className={styles.keywordItem}>
                <ListingElement label={keyword} onDelete={() => handleDeleteKeyword(keyword)} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default KeywordListForm
