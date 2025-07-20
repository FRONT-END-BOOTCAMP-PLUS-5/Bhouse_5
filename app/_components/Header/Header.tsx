// Header.tsx
'use client'

import React, { useState, useEffect } from 'react'
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
type UserType = 'USER' | 'OWNER'

const Header: React.FC = () => {
  const [search, setSearch] = useState('')
  const { isLogin, setLogout, user } = useAuthStore()
  // selectedRegion 초기값을 '동네 선택'으로 설정하여 빈칸 방지
  const [selectedRegion, setSelectedRegion] = useState<string>('동네 선택')

  const router = useRouter()

  const currentUserType = user.user_role.name
  const profileImageUrl = user?.profile_img_url || '/images/user_empty_profile_img.png'

  // user.towns 데이터가 로드되면 selectedRegion을 업데이트
  useEffect(() => {
    // console.log("Header useEffect 실행됨. isLogin:", isLogin, "user.towns:", user.towns) // 디버깅 로그 제거
    if (isLogin && user.towns && user.towns.length > 0) {
      const firstTown = user.towns[0]
      // firstTown.name 대신 firstTown.town_name 사용
      if (firstTown && firstTown.town_name) {
        // 첫 번째 동네 객체와 그 town_name 속성이 존재하는지 확인
        setSelectedRegion(firstTown.town_name)
        // console.log("selectedRegion을 다음으로 설정:", firstTown.town_name) // 디버깅 로그 제거
      } else {
        // 첫 번째 동네의 town_name이 없거나 유효하지 않을 경우
        setSelectedRegion('동네 선택')
        // console.log("첫 번째 동네 이름이 유효하지 않아 '동네 선택'으로 설정") // 디버깅 로그 제거
      }
    } else {
      setSelectedRegion('동네 선택')
      // console.log("로그인 상태가 아니거나 동네가 없어 '동네 선택'으로 설정") // 디버깅 로그 제거
    }
  }, [isLogin, user.towns]) // user.towns 배열의 참조가 변경될 때마다 실행

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName)
    // console.log(`${regionName} 선택됨`) // 디버깅 로그 제거
    // TODO: 선택된 동네에 따라 데이터를 필터링하는 로직 추가
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
                    svgComponent={BellIcon}
                    svgWidth={25}
                    svgHeight={25}
                    svgFill="white"
                    imageAlt="알림 아이콘"
                    bgColor="var(--primary-blue)"
                    size={40}
                  />
                }
              />
              {/* 사용자 프로필 드롭다운 */}
              <ProfileDropdown
                trigger={
                  <CircleButton
                    imageUrl={profileImageUrl}
                    imageSize={40}
                    imageAlt="프로필 이미지"
                    bgColor="transparent"
                    size={40}
                  />
                }
                userType={currentUserType as UserType}
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
          />
          <Dropdown label={selectedRegion} borderRadius="8" size="small">
            {user.towns && user.towns.length > 0 ? (
              user.towns.map((town, index) => (
                // 동네 이름이 유효한지 확인하고, 없으면 '알 수 없는 동네'로 표시
                // town.name 대신 town.town_name 사용
                <li key={index} onClick={() => handleRegionSelect(town.town_name)}>
                  {town.town_name || '알 수 없는 동네'}
                </li>
              ))
            ) : (
              <li>등록된 동네가 없습니다.</li>
            )}
            <Divider marginY="8px" />
            {/* handleAddLocationClick 함수 대신 href 속성으로 변경 */}
            <li>
              <Button
                variant="primary"
                size="small"
                borderRadius="8"
                className={styles.buttonAsListItem}
                href="/user/towns/register"
              >
                내 동네 추가하기
              </Button>
            </li>
          </Dropdown>
        </div>
      ) : (
        <div className={styles.searchAndDropdown} style={{ justifyContent: 'flex-end' }}>
          <TextInput
            type="text"
            placeholder="지금 인기있는 보드게임"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* 하단 섹션: 내비게이션 버튼들 (왼쪽 정렬) */}
      <nav className={styles.navigation}>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton} href="/">
          홈
        </Button>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton} href="/boardgames">
          보드게임
        </Button>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton} href="/community/posts">
          커뮤니티
        </Button>
        <Button variant="ghost" size="small" borderRadius="60" className={styles.navButton} href="/">
          지도
        </Button>
      </nav>

      {/* 구분선 (헤더 상단과 하단 메뉴 사이) */}
      <Divider marginY="0px" />
    </header>
  )
}

export default Header
