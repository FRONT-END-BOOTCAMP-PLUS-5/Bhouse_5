// _components/InquiryForm/InquiryForm.tsx
'use client'

import React, { useState, useEffect } from 'react'
import TextInput from '@/_components/TextInput/TextInput' // TextInput 컴포넌트 임포트
import Button from '@/_components/Button/Button' // Button 컴포넌트 임포트
import styles from './InquiryForm.module.css' // InquiryForm 전용 CSS 모듈
import { useAuthStore } from '@store/auth.store' // useAuthStore 임포트

const InquiryForm: React.FC = () => {
  const { user } = useAuthStore() // useAuthStore에서 user 데이터 가져오기

  // 사용자 이메일 상태. user.email이 있으면 사용하고, 없으면 빈 문자열로 초기화
  const [email, setEmail] = useState(user?.email || '')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')

  // user 데이터가 로드되거나 변경될 때 이메일 상태 업데이트
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user?.email]) // user.email이 변경될 때만 실행

  // 모든 입력 필드에 값이 있는지 확인하여 버튼 활성화 여부 결정
  const isFormValid = email.trim() !== '' && subject.trim() !== '' && description.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // 폼 기본 제출 동작 방지

    if (isFormValid) {
      // 실제 문의 제출 로직 (백엔드 API 호출 등)은 여기에 구현
      console.log('문의 제출:', { email, subject, description })

      // 제출 성공 시 입력 필드 초기화
      // 이메일은 user.email에 따라 자동으로 채워지므로, 여기서는 subject와 description만 초기화
      setSubject('')
      setDescription('')

      // 사용자에게 알림 메시지 표시 (alert 대신 커스텀 모달 UI 사용 권장)
      alert('문의가 접수되었습니다! 영업일 기준 5일 이내 답변됩니다.')
    } else {
      alert('모든 필드를 채워주세요.')
    }
  }

  return (
    <form className={styles.inquiryForm} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>문의 넣기</h2>

      {/* 사용자 이메일 입력란 */}
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          이메일
        </label>
        <TextInput
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.fullWidthInput}
          readOnly={!!user?.email} // user.email이 있으면 읽기 전용으로 설정
        />
      </div>

      {/* 문의 제목 텍스트인풋 */}
      <div className={styles.inputGroup}>
        <label htmlFor="subject" className={styles.label}>
          제목
        </label>
        <TextInput
          id="subject"
          type="text"
          placeholder="문의 제목을 입력하세요"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={styles.fullWidthInput}
        />
      </div>

      {/* 문의 내용 텍스트인풋 (Textarea) */}
      <div className={styles.inputGroup}>
        <label htmlFor="description" className={styles.label}>
          내용
        </label>
        <TextInput
          id="description"
          type="textarea" // Textarea 타입 사용
          placeholder="여기에 상세 문의 내용을 입력하세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.fullWidthTextarea}
        />
      </div>

      {/* 문의 제출하기 버튼 */}
      <Button
        type="submit" // 폼 제출 버튼
        variant="primary"
        size="large"
        borderRadius="8"
        disabled={!isFormValid} // 유효성 검사에 따라 버튼 활성화/비활성화
        className={styles.submitButton}
      >
        문의 제출하기
      </Button>
    </form>
  )
}

export default InquiryForm
