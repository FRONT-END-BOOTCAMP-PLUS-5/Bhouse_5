// ProfileDropdown/ProfileDropdown.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
// useRouter는 더 이상 직접적인 페이지 이동을 담당하지 않으므로 제거할 수 있지만,
// 만약 다른 용도로 필요하다면 유지해도 무방합니다. 여기서는 일단 유지합니다.
import { useRouter } from 'next/navigation'
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
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ trigger, userType, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter() // useRouter 초기화 (다른 용도로 필요할 수 있어 유지)

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
                href="/my" // FIXME: 마이페이지 경로로 변경
                onClick={() => setIsOpen(false)} // 버튼 클릭 시 드롭다운 닫기
              >
                마이페이지
              </Button>
            </li>
            {userType === 'OWNER' && ( // OWNER일 때만 업장 관리 버튼 렌더링
              <li>
                <Button
                  borderRadius="8"
                  variant="secondaryWhite"
                  fontStyle="fontLight"
                  className={styles.dropdownButton}
                  href="/" // FIXME: 업장 관리 페이지 경로로 변경 (OWNER 전용)
                  onClick={() => setIsOpen(false)} // 버튼 클릭 시 드롭다운 닫기
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
                href="/" // FIXME: 찜 목록 보기 페이지 경로로 변경
                onClick={() => setIsOpen(false)} // 버튼 클릭 시 드롭다운 닫기
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
                href="/" // FIXME: 내 활동 보기 페이지 경로로 변경
                onClick={() => setIsOpen(false)} // 버튼 클릭 시 드롭다운 닫기
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
                onClick={onLogout} // 로그아웃은 여전히 Header에서 처리 (로그인 상태 관리와 관련)
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
