'use client'

import styles from './page.module.css'
import Button from './_components/Button/Button'
import React, { useState } from 'react'
import Dropdown from './_components/Dropdown/Dropdown'
import TextInput from './_components/TextInput/TextInput'

export default function Home() {
  const [email, setEmail] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [selectedRegion, setSelectedRegion] = useState('중랑구')

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    console.log(`${region} 선택됨`)
    // 드롭다운 닫는 로직은 Dropdown 컴포넌트 내부에서 처리됩니다.
  }

  const handleAddLocationClick = () => {
    console.log('내 동네 추가하기 버튼 클릭')
    // 새 동네 추가 로직
  }

  return (
    <div className={styles.page}>
      <p className={styles.title48}>보드의 집</p>
      <h1 className={styles.boldText}>환영합니다!</h1>
      <p className={styles.regularText}>이것은 나눔스퀘어 레귤러 텍스트입니다.</p>
      <p className={styles.header48}>이것 텍스트입니다. (header48)</p>
      <p className={styles.extraBoldText}>이것은 나눔스퀘어 엑스트라볼드 텍스트입니다.</p>

      <button className={styles.button}>클릭하세요</button>

      <Button borderRadius="8" variant="primary">
        기본 버튼
      </Button>
      <Button borderRadius="16" variant="secondary">
        둥근 버튼
      </Button>
      <Button borderRadius="60" variant="ghost" size="small">
        아주 둥근 버튼
      </Button>
      <Button borderRadius="12" variant="primary" size="large" onClick={() => alert('클릭!')}>
        클릭!
      </Button>

      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // 가로 길이를 화면 비율에 맞춰 늘리고 싶다면 width: 100%를 className으로 전달
          className={styles.fullWidthInput} // CSS 모듈에 .fullWidthInput 정의 필요
        />
      </div>

      {/* 피그마의 '지금 인기있는 보드게임은?' 부분 - 검색 입력 */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="text"
          placeholder="지금 인기있는 보드게임은?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.fixedWidthInput}
        />
      </div>

      {/* 여러 줄 입력 (Textarea) 예시 */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="textarea"
          placeholder="여기에 상세 설명을 입력하세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.fullWidthTextarea}
        />
      </div>

      {/* 드롭다운 (회색 배경, round 8) */}
      <Dropdown label={selectedRegion}>
        <li onClick={() => handleRegionSelect('중랑구')}>중랑구</li>
        <li onClick={() => handleRegionSelect('은평구')}>은평구</li>
        <li onClick={() => handleRegionSelect('강남구')}>강남구</li>
        {/* data-disabled 속성은 스타일링을 위한 것이며, 실제 이벤트 발생을 막으려면 onClick을 제거하거나 핸들러 내에서 return; 해야 합니다. */}
        <li onClick={() => handleRegionSelect('서초구')} data-disabled="true">
          서초구 (선택 불가)
        </li>
        <li>
          {/* 드롭다운 리스트 안에 Button 컴포넌트 활용 */}
          <Button
            onClick={handleAddLocationClick}
            variant="primary"
            size="small"
            borderRadius="8"
            className={styles.buttonAsListItem} // module.css에서 정의된 클래스 활용
          >
            내 동네 추가하기
          </Button>
        </li>
      </Dropdown>

      {/* 커스텀 색상 및 둥글기 드롭다운 예시 */}
      <Dropdown label="카테고리 선택" fillColor="#E8F5E9" borderRadius="16">
        <li onClick={() => console.log('식료품 선택')}>식료품</li>
        <li onClick={() => console.log('의류 선택')}>의류</li>
        <li onClick={() => console.log('전자제품 선택')}>전자제품</li>
      </Dropdown>

      {/* 최대 높이를 가진 드롭다운 예시 */}
      <Dropdown label="긴 리스트" maxHeight="150px">
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i} onClick={() => console.log(`아이템 ${i + 1} 선택`)}>
            아이템 {i + 1}
          </li>
        ))}
      </Dropdown>
    </div>
  )
}
