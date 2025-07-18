'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styles from './Header.module.css'
import Button from '../Button/Button'
import Dropdown from '../Dropdown/Dropdown'
import TextInput from '../TextInput/TextInput'
import Divider from '../Divider/Divider'
import CircleButton from '../CircleButton/CircleButton'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'
import AlarmDropdown from '../AlarmDropdown/AlarmDropdown'

import BellIcon from '@public/icons/bell.svg'

import { useAuthStore } from '@store/auth.store'
import { signoutService } from 'models/services/auth.service'

const Header: React.FC = () => {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('중랑구')

  const router = useRouter()

  const { isLogin, nickname, setLogout, user } = useAuthStore()
  const currentUserType = user.user_role.name
  const profileImageUrl = user?.profile_img_url || '/images/user_empty_profile_img.png'
  console.log(profileImageUrl)
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    console.log(`${region} 선택됨`)
  }

  const handleAddLocationClick = () => {
    console.log('내 동네 추가하기 버튼 클릭')
  }

  const handleLogoutClick = async () => {
    try {
      await signoutService()
      setLogout()
      router.push('/')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <header className={styles.header}>
      {/* 상단 섹션: 로고, 로그인/회원가입, 검색창, 드롭다운 */}
      <div className={styles.headerTop}>
        {/* 로고 영역 */}
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/images/rounded_logo.png"
            alt="보드게임 주사위 로고"
            className={styles.logo}
            width={60}
            height={60}
          />
        </Link>

        {/* 로그인/회원가입 영역 또는 알림/프로필 드롭다운 */}
        <div className={styles.authSection}>
          {isLogin ? (
            <>
              {/* 알림 드롭다운 컴포넌트 사용 */}
              <AlarmDropdown
                trigger={
                  <CircleButton
                    svgComponent={BellIcon} // BellIcon 컴포넌트를 직접 전달
                    svgWidth={25} // 아이콘 너비
                    svgHeight={25} // 아이콘 높이
                    svgFill="white" // 아이콘 색상
                    imageAlt="알림 아이콘" // 접근성용 대체 텍스트
                    bgColor="var(--primary-blue)"
                    size={40}
                  />
                }
              />
              {/* 사용자 프로필 드롭다운 */}
              <ProfileDropdown
                trigger={
                  <CircleButton
                    imageUrl={profileImageUrl} // 이미지 URL을 직접 전달
                    imageSize={40} // 이미지 크기
                    imageAlt="프로필 이미지" // 접근성용 대체 텍스트
                    bgColor="transparent" // 배경은 투명
                    size={40}
                  />
                }
                userType={currentUserType}
                onLogout={handleLogoutClick}
              />
            </>
          ) : (
            <>
              <Link className={styles.loginText} href="/auth/signin">
                로그인
              </Link>
              <Button variant="primary" size="small" borderRadius="8" href="/auth/signup">
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
