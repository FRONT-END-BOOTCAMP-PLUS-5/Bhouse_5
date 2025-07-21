// src/components/KeywordListForm/KeywordListForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import styles from './KeywordListForm.module.css' // 컴포넌트 전용 CSS 모듈
import TextInput from '@/_components/TextInput/TextInput' // TextInput 컴포넌트 경로
import ListingElement from '@/_components/ListingElement/ListingElement' // ListingElement 컴포넌트 경로
import { useGetKeywordList, usePostKeyword, useDeleteKeyword } from 'models/querys/keyword.query' // 새로 생성한 쿼리 훅 임포트

const KeywordListForm: React.FC = () => {
  const [newKeyword, setNewKeyword] = useState<string>('')

  const { data: keywords, isLoading, isError, error } = useGetKeywordList()
  const { mutate: postKeywordMutate, isPending: isPosting } = usePostKeyword()
  const { mutate: deleteKeywordMutate, isPending: isDeleting } = useDeleteKeyword()
  console.log('키워드 목록:', keywords)

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedKeyword = newKeyword.trim()

    // keywords가 undefined일 경우를 대비하여 빈 배열로 초기화 (또는 로딩 상태에서 처리)
    const currentKeywords = keywords || []
    const isDuplicate = currentKeywords.some((k) => k.keyword.toLowerCase() === trimmedKeyword.toLowerCase())

    if (trimmedKeyword !== '' && !isDuplicate) {
      postKeywordMutate({ keyword: trimmedKeyword })
      setNewKeyword('')
    } else if (isDuplicate) {
      alert('이미 등록된 키워드입니다.')
    }
  }

  // handleDeleteKeyword 함수는 keywordId를 인자로 받도록 수정
  const handleDeleteKeyword = (keywordIdToDelete: number) => {
    deleteKeywordMutate({ keyword_id: keywordIdToDelete })
  }

  if (isLoading) return <div className={styles.loadingMessage}>키워드 목록을 불러오는 중입니다...</div>
  if (isError) return <div className={styles.errorMessage}>키워드 목록을 불러오는데 실패했습니다: {error?.message}</div>

  return (
    <div className={styles.keywordListFormContainer}>
      <form onSubmit={handleAddKeyword} className={styles.keywordInputSection}>
        <TextInput
          type="text"
          placeholder="알림 받을 키워드 추가하기"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          size="medium"
          className={styles.keywordInput}
          hasButton={true}
          buttonLabel={isPosting ? '등록 중...' : '등록'}
          onButtonClick={handleAddKeyword}
          disabled={isPosting}
        />
      </form>

      <div className={styles.keywordList}>
        <ul className={styles.keywordItems}>
          {keywords && keywords.length === 0 ? (
            <li className={styles.noKeywords}>등록된 키워드가 없습니다.</li>
          ) : (
            // keywordId를 key로 사용하고, onDelete에는 keywordId를 직접 전달
            keywords?.map((keywordItem) => (
              <li key={keywordItem.keywordId} className={styles.keywordItem}>
                <ListingElement
                  label={keywordItem.keyword}
                  onDelete={() => {
                    alert(`${keywordItem.keyword}가 삭제되었습니다.`)
                    handleDeleteKeyword(keywordItem.keywordId)
                  }}
                  disabled={isDeleting}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default KeywordListForm
