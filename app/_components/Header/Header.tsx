'use client'

import React, { useState } from 'react'
import styles from './Header.module.css' // Header 전용 CSS 모듈
import Button from '../Button/Button' // Button 컴포넌트 경로
import Dropdown from '../Dropdown/Dropdown' // Dropdown 컴포넌트 경로
import TextInput from '../TextInput/TextInput' // TextInput 컴포넌트 경로
import Divider from '../Divider/Divider' // Divider 컴포넌트 경로

const Header: React.FC = () => {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('중랑구')

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    console.log(`${region} 선택됨`)
  }

  const handleAddLocationClick = () => {
    console.log('내 동네 추가하기 버튼 클릭')
  }

  return (
    <header className={styles.header}>
      {/* 상단 섹션: 로고, 검색창, 드롭다운, 사용자 아이콘 */}
      <div className={styles.headerTop}>
        {/* 로고 영역 */}
        <div className={styles.logoContainer}>
          {/* public 폴더에 dice-logo.png 이미지를 넣어두세요. */}
          <img src="/images/rounded_logo.png" alt="보드게임 주사위 로고" className={styles.logo} />
          {/* 만약 '보드의 집' 텍스트를 로고 옆에 넣는다면: */}
          {/* <span className={styles.logoText}>보드의 집</span> */}
        </div>

        {/* 검색 입력 및 드롭다운, 사용자 아이콘 */}
        <div className={styles.headerRight}>
          <TextInput
            type="text"
            placeholder="지금 인기있는 보드게임은?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <Dropdown label={selectedRegion} borderRadius="8">
            {/*FIXME : 유저 정보 내 town으로 변경하기*/}
            <li onClick={() => handleRegionSelect('중랑구')}>중랑구</li>
            <li onClick={() => handleRegionSelect('은평구')}>은평구</li>
            <li onClick={() => handleRegionSelect('강남구')}>강남구</li>
            <li onClick={() => handleRegionSelect('서초구')} data-disabled="true">
              서초구 (선택 불가)
            </li>
            <Divider marginY="8px" />
            <li>
              <Button
                onClick={handleAddLocationClick}
                variant="primary"
                size="small"
                borderRadius="8"
                className={styles.buttonAsListItem}
              >
                내 동네 추가하기
              </Button>
            </li>
          </Dropdown>
          <div className={styles.userIconContainer}>
            {/* 사용자 아이콘 - Font Awesome 제거로 인해 임시로 텍스트로 대체 */}
            <span>👤</span>
          </div>
        </div>
      </div>

      {/* 구분선 (헤더 상단과 하단 메뉴 사이) */}
      <Divider marginY="15px" />

      {/* 하단 섹션: 내비게이션 버튼들 */}
      <nav className={styles.navigation}>
        <Button variant="ghost" size="medium" borderRadius="60" className={styles.navButton}>
          홈
        </Button>
        <Button variant="ghost" size="medium" borderRadius="60" className={styles.navButton}>
          보드게임
        </Button>
        <Button variant="ghost" size="medium" borderRadius="60" className={styles.navButton}>
          커뮤니티
        </Button>
        <Button variant="ghost" size="medium" borderRadius="60" className={styles.navButton}>
          지도
        </Button>
      </nav>
    </header>
  )
}

export default Header
