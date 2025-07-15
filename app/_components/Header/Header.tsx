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

  const handleLoginClick = () => {
    console.log('로그인 텍스트 클릭')
    // TODO: 로그인 페이지로 이동하는 로직 추가
    window.location.href = '/login' // 예시: /login 경로로 이동
  }

  const handleSignUpClick = () => {
    console.log('회원가입 버튼 클릭')
    // TODO: 회원가입 페이지로 이동하는 로직 추가
    window.location.href = '/signup' // 예시: /signup 경로로 이동
  }

  return (
    <header className={styles.header}>
      {/* 상단 섹션: 로고, 로그인/회원가입, 검색창, 드롭다운 */}
      <div className={styles.headerTop}>
        {/* 로고 영역 */}
        <div className={styles.logoContainer}>
          <a href="http://localhost:3000/">
            {' '}
            {/* 로고 이미지 클릭 시 이동 */}
            <img src="/images/rounded_logo.png" alt="보드게임 주사위 로고" className={styles.logo} />
          </a>
        </div>

        {/* 로그인/회원가입 영역 */}
        <div className={styles.authSection}>
          <a href="http://localhost:3000/auth/signin" className={styles.loginText}>
            로그인
          </a>
          <Button variant="primary" size="small" borderRadius="8" onClick={handleSignUpClick}>
            회원가입
          </Button>
        </div>
      </div>

      {/* 검색 입력 및 드롭다운 (새로운 행) */}
      <div className={styles.searchAndDropdown}>
        <TextInput
          type="text"
          placeholder="지금 인기있는 보드게임"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          size="small" // 여기에 size="small" 추가
        />
        <Dropdown label={selectedRegion} borderRadius="8" size="small">
          {' '}
          {/* 여기에 size="small" 추가 */}
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
      </div>

      {/* 하단 섹션: 내비게이션 버튼들 (왼쪽 정렬) */}
      <nav className={styles.navigation}>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton}>
          홈
        </Button>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton}>
          보드게임
        </Button>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton}>
          커뮤니티
        </Button>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton}>
          지도
        </Button>
      </nav>

      {/* 구분선 (헤더 상단과 하단 메뉴 사이) */}
      <Divider marginY="15px" />
    </header>
  )
}

export default Header
