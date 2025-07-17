'use client'

import React, { useState, useEffect } from 'react' // useEffect 추가
import Image from 'next/image' // Image 컴포넌트를 사용하기 위해 임포트합니다.

import styles from './Header.module.css'
import Button from '../Button/Button'
import Dropdown from '../Dropdown/Dropdown'
import TextInput from '../TextInput/TextInput'
import Divider from '../Divider/Divider'
import CircleButton from '../CircleButton/CircleButton'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'
import AlarmDropdown from '../AlarmDropdown/AlarmDropdown'

import BellIcon from '@public/icons/bell.svg'

import { useAuthStore } from '@store/auth.store' // Auth 스토어 경로

const Header: React.FC = () => {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('중랑구')

  // useAuthStore에서 isLogin 상태, 닉네임, setLogout 액션을 가져옵니다.
  const { isLogin, nickname, setLogout, user } = useAuthStore()
  const currentUserType = user.user_role.name
  const profileImageUrl = user?.profile_img_url || '/images/user_empty_profile_img.png'
  console.log('userprofileImage : ', profileImageUrl)

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    console.log(`${region} 선택됨`)
  }

  const handleAddLocationClick = () => {
    console.log('내 동네 추가하기 버튼 클릭')
  }

  const handleLoginClick = () => {
    console.log('로그인 텍스트 클릭')
    window.location.href = '/auth/signin'
  }

  const handleSignUpClick = () => {
    console.log('회원가입 버튼 클릭')
    window.location.href = '/auth/signup'
  }

  const handleLogoutClick = () => {
    console.log('로그아웃 버튼 클릭')
    setLogout() // Zustand 스토어의 setLogout 액션을 호출합니다.
    window.location.href = '/'
  }

  // ProfileDropdown에 전달할 핸들러 함수들
  const handleMyPageClick = () => {
    console.log('마이페이지 클릭')
    // TODO: 마이페이지로 이동 로직
  }

  const handleStoreManagementClick = () => {
    console.log('업장 관리 클릭')
    // TODO: 업장 관리 페이지로 이동 로직 (OWNER 전용)
  }

  const handleWishlistClick = () => {
    console.log('찜 목록 보기 클릭')
    // TODO: 찜 목록 페이지로 이동 로직
  }

  const handleMyActivitiesClick = () => {
    console.log('내 활동 보기 클릭')
    // TODO: 내 활동 페이지로 이동 로직
  }

  return (
    <header className={styles.header}>
      {/* 상단 섹션: 로고, 로그인/회원가입, 검색창, 드롭다운 */}
      <div className={styles.headerTop}>
        {/* 로고 영역 */}
        <div className={styles.logoContainer}>
          <a href="http://localhost:3000/">
            <img src="/images/rounded_logo.png" alt="보드게임 주사위 로고" className={styles.logo} />
          </a>
        </div>

        {/* 로그인/회원가입 영역 또는 알림/프로필 드롭다운 */}
        <div className={styles.authSection}>
          {isLogin ? (
            <>
              {/* 알림 드롭다운 컴포넌트 사용 */}
              <AlarmDropdown
                trigger={
                  <CircleButton
                    icon={<BellIcon width={25} height={25} fill="white" />}
                    iconAlt="알림"
                    bgColor="var(--primary-blue)"
                    size={40}
                  />
                }
              />
              {/* 사용자 프로필 드롭다운 */}
              <ProfileDropdown
                trigger={
                  // 프로필 이미지: next/image 컴포넌트를 icon prop에 직접 전달합니다.
                  <CircleButton
                    icon={
                      <Image
                        src={profileImageUrl}
                        alt="프로필 이미지" // Next.js Image 컴포넌트에 alt 텍스트 필수
                        width={30} // 이미지의 실제 표시 너비
                        height={30} // 이미지의 실제 표시 높이
                        style={{ borderRadius: '50%', objectFit: 'cover' }} // 이미지를 원형으로 만들고 버튼에 맞게 채움
                      />
                    }
                    iconAlt="프로필" // 이 prop은 이제 CircleButton 내부에서 직접 사용되지 않음
                    bgColor="transparent" // 프로필 이미지 배경은 투명하게 설정
                    size={40} // CircleButton의 전체 크기
                  />
                }
                userType={currentUserType}
                onLogout={handleLogoutClick}
                onMyPageClick={handleMyPageClick}
                onStoreManagementClick={handleStoreManagementClick}
                onWishlistClick={handleWishlistClick}
                onMyActivitiesClick={handleMyActivitiesClick}
              />
            </>
          ) : (
            <>
              <a href="http://localhost:3000/auth/signin" className={styles.loginText} onClick={handleLoginClick}>
                로그인
              </a>
              <Button variant="primary" size="small" borderRadius="8" onClick={handleSignUpClick}>
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 검색 입력 및 드롭다운 (새로운 행) */}
      {isLogin ? (
        <div className={styles.searchAndDropdown}>
          <TextInput
            type="text"
            placeholder="지금 인기있는 보드게임"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            size="small"
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
      ) : (
        // 드롭다운이 있어야 할 자리에 레이아웃 유지를 위한 빈 공간을 만듭니다.
        // 필요에 따라 이 부분도 로딩 스피너 등으로 대체할 수 있습니다.
        <div className={styles.searchAndDropdown} style={{ justifyContent: 'flex-end' /* 기존 정렬 유지 */ }}>
          <TextInput
            type="text"
            placeholder="지금 인기있는 보드게임"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            size="small"
          />
        </div>
      )}

      {/* 하단 섹션: 내비게이션 버튼들 (왼쪽 정렬) */}
      {/* FIXME(@아무나) : 현재 페이지에서 색상 변경 */}
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
      <Divider marginY="0px" />
    </header>
  )
}

export default Header
