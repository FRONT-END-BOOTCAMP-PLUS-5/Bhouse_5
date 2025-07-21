// Header.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation' // usePathname 임포트

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
import BoardgameSearch from '@/(anon)/store-register/_components/BoardgameSearch'
type UserType = 'USER' | 'OWNER'

const Header: React.FC = () => {
  const [search, setSearch] = useState('')
  const { isLogin, setLogout, user } = useAuthStore()
  const [selectedRegion, setSelectedRegion] = useState<string>('동네 선택')

  const router = useRouter()
  const pathname = usePathname() // 현재 경로 가져오기

  const currentUserType = user.user_role.name
  const profileImageUrl = user?.profile_img_url || '/images/user_empty_profile_img.png'

  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const handleSelectGame = (game: string) => {
    if (!selectedGames.includes(game)) {
      setSelectedGames((prev) => [...prev, game])
    }
  }
  // user.towns 데이터가 로드되면 selectedRegion을 업데이트
  useEffect(() => {
    if (isLogin && user.towns && user.towns.length > 0) {
      const firstTown = user.towns[0]
      if (firstTown && firstTown.town_name) {
        setSelectedRegion(firstTown.town_name)
      } else {
        setSelectedRegion('동네 선택')
      }
    } else {
      setSelectedRegion('동네 선택')
    }
  }, [isLogin, user.towns])

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName)
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
              <Button variant="primary" size="small" borderRadius="8" href="/auth/signup/usertype">
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 검색 입력 및 드롭다운 (새로운 행) */}
      {isLogin ? (
        <div className={styles.searchAndDropdown}>
          <BoardgameSearch
            onSelect={handleSelectGame}
            className="boardgameSearch"
            placeholder="지금 인기있는 보드게임"
            onSelectGame={(id) => router.push(`/boardgame-detail/${id}`)}
          />
          <Dropdown label={selectedRegion} borderRadius="8" size="small">
            {user.towns && user.towns.length > 0 ? (
              user.towns.map((town, index) => (
                <li key={index} onClick={() => handleRegionSelect(town.town_name)}>
                  {town.town_name || '알 수 없는 동네'}
                </li>
              ))
            ) : (
              <li>등록된 동네가 없습니다.</li>
            )}
            <Divider marginY="8px" />
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
          <BoardgameSearch
            onSelect={handleSelectGame}
            className="boardgameSearch"
            placeholder="지금 인기있는 보드게임"
            onSelectGame={(id) => router.push(`/boardgame-detail/${id}`)}
          />
        </div>
      )}

      {/* 하단 섹션: 내비게이션 버튼들 (왼쪽 정렬) */}
      <nav className={styles.navigation}>
        <Button
          variant="ghost"
          size="small"
          borderRadius="60"
          className={`${styles.navButton} ${pathname === '/' ? styles.activeNavButton : ''}`}
          href="/"
        >
          홈
        </Button>
        <Button
          variant="ghost"
          size="small"
          borderRadius="60"
          className={`${styles.navButton} ${pathname === '/boardgames' ? styles.activeNavButton : ''}`}
          href="/boardgames"
        >
          보드게임
        </Button>
        <Button
          variant="ghost"
          size="small"
          borderRadius="60"
          className={`${styles.navButton} ${pathname.startsWith('/community/posts') ? styles.activeNavButton : ''}`}
          href="/community/posts"
        >
          커뮤니티
        </Button>
        <Button
          variant="ghost"
          size="small"
          borderRadius="60"
          className={`${styles.navButton} ${pathname === '/map' ? styles.activeNavButton : ''}`}
          href="/map"
        >
          지도
        </Button>
      </nav>

      {/* 구분선 (헤더 상단과 하단 메뉴 사이) */}
      <Divider marginY="0px" />
    </header>
  )
}

export default Header
