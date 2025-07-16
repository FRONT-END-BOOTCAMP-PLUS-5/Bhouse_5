// ProfileDropdown/ProfileDropdown.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './ProfileDropdown.module.css'
import Button from '../Button/Button' // Button 컴포넌트 경로 확인

// 회원 유형 정의 (실제 UserProfileResponseDto에 포함될 수 있음)
type UserType = 'USER' | 'OWNER'

interface ProfileDropdownProps {
  /** 드롭다운을 트리거하는 요소 (예: 프로필 이미지) */
  trigger: React.ReactNode
  /** 현재 로그인한 유저의 타입 */
  userType: UserType
  /** 로그아웃 버튼 클릭 시 실행될 함수 */
  onLogout: () => void
  /** 마이페이지 버튼 클릭 시 실행될 함수 */
  onMyPageClick: () => void
  /** 업장 관리 버튼 클릭 시 실행될 함수 (OWNER 전용) */
  onStoreManagementClick?: () => void
  /** 찜 목록 보기 버튼 클릭 시 실행될 함수 */
  onWishlistClick: () => void
  /** 내 활동 보기 버튼 클릭 시 실행될 함수 */
  onMyActivitiesClick: () => void
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  trigger,
  userType,
  onLogout,
  onMyPageClick,
  onStoreManagementClick,
  onWishlistClick,
  onMyActivitiesClick,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.profileDropdownContainer} ref={dropdownRef}>
      <div className={styles.profileDropdownTrigger} onClick={toggleDropdown}>
        {trigger}
      </div>
      {isOpen && (
        <div className={styles.profileDropdownListWrapper}>
          <ul className={styles.profileDropdownList}>
            <li>
              <Button
                borderRadius="8"
                variant="secondaryWhite"
                fontStyle="fontLight"
                className={styles.dropdownButton}
                onClick={onMyPageClick}
              >
                마이페이지
              </Button>
            </li>
            {userType === 'OWNER' &&
              onStoreManagementClick && ( // OWNER일 때만 업장 관리 버튼 렌더링
                <li>
                  <Button
                    borderRadius="8"
                    variant="secondaryWhite"
                    fontStyle="fontLight"
                    className={styles.dropdownButton}
                    onClick={onStoreManagementClick}
                  >
                    업장 관리
                  </Button>
                </li>
              )}
            <li>
              <Button
                borderRadius="8"
                variant="secondaryWhite"
                fontStyle="fontLight"
                className={styles.dropdownButton}
                onClick={onWishlistClick}
              >
                찜 목록 보기
              </Button>
            </li>
            <li>
              <Button
                borderRadius="8"
                variant="secondaryWhite"
                fontStyle="fontLight"
                className={styles.dropdownButton}
                onClick={onMyActivitiesClick}
              >
                내 활동 보기
              </Button>
            </li>
            <li>
              <Button
                borderRadius="8"
                variant="secondaryWhite"
                fontStyle="fontLight"
                className={styles.logoutButton}
                onClick={onLogout}
              >
                로그아웃
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
