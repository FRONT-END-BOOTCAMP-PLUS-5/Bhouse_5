'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './NotificationDropdown.module.css' // 새로 생성할 CSS 모듈
import Button from '../Button/Button' // Button 컴포넌트 임포트

// 알림 데이터 타입 정의 (필요에 따라 별도 types 폴더로 분리 가능)
interface BaseNotification {
  id: string
  is_read: boolean
  created_at: string // ISO string 또는 Date가 파싱할 수 있는 형식
}

export interface KeywordNotification extends BaseNotification {
  type: 'keyword'
  message: string
}

export interface ReplyNotification extends BaseNotification {
  type: 'reply'
  title: string
}

export type Notification = KeywordNotification | ReplyNotification

interface NotificationDropdownProps {
  trigger: React.ReactNode // 벨 아이콘 등 드롭다운을 여는 요소
}

// 시간 포맷을 "X분 전", "X시간 전" 등으로 변환하는 헬퍼 함수
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const minutes = Math.floor(diffSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years}년 전`
  if (months > 0) return `${months}달 전`
  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // API로부터 올 데이터와 유사하게 하드코딩된 알림 데이터
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'noti-1',
      type: 'reply',
      title: '새 답글 님이랑은 보드게임 안...',
      is_read: false, // 안 읽음: 검은색, 붉은 뱃지
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3분 전
    },
    {
      id: 'noti-2',
      type: 'keyword',
      message: '키워드 알림 마피아 2명만 더 오면...',
      is_read: false, // 안 읽음: 검은색, 붉은 뱃지
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
    },
    {
      id: 'noti-3',
      type: 'keyword',
      message: '키워드 알림 제발와주세요급구',
      is_read: true, // 읽음: 회색
      created_at: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 두 달 전
    },
    // 실제 API 연동 시에는 여기에 데이터를 fetch하는 로직이 들어갑니다.
  ])

  const unreadCount = notifications.filter((n) => !n.is_read).length // 읽지 않은 알림 개수 계산

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  // 드롭다운 외부 클릭 시 닫기
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

  // 모든 알림을 읽음으로 처리
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((noti) => ({ ...noti, is_read: true })))
    console.log('모든 알림 읽음 처리')
  }

  // 개별 알림 클릭 시 읽음으로 처리 및 동작
  const handleNotificationClick = (id: string) => {
    setNotifications((prev) => prev.map((noti) => (noti.id === id ? { ...noti, is_read: true } : noti)))
    console.log(`알림 ${id} 클릭됨`)
    // TODO: 알림 클릭 시 해당 상세 페이지로 이동하는 로직 추가
  }

  // 알림 설정 버튼 클릭 시 동작
  const handleNotificationSettingsClick = () => {
    console.log('알림 설정 버튼 클릭')
    // TODO: 알림 설정 페이지로 이동하는 로직 추가
  }

  return (
    <div className={styles.notificationDropdownContainer} ref={dropdownRef}>
      <div onClick={handleToggle} className={styles.triggerWrapper}>
        {trigger}
        {unreadCount > 0 && <span className={styles.unreadCountBadge}>{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className={styles.notificationDropdownListWrapper}>
          <div className={styles.headerRow}>
            <button onClick={handleMarkAllAsRead} className={styles.readAllText}>
              모두 읽기
            </button>
          </div>
          <ul className={styles.notificationList}>
            {notifications.length === 0 ? (
              <li className={styles.noNotifications}>새로운 알림이 없습니다.</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`${styles.notificationItem} ${notification.is_read ? styles.read : styles.unread}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className={styles.firstRow}>
                    {' '}
                    {/* 첫 번째 줄: 알림 타입 */}
                    {notification.type === 'reply' ? (
                      <span className={styles.notificationType}>새 답글</span>
                    ) : (
                      <span className={styles.notificationType}>키워드 알림</span>
                    )}
                  </div>
                  <div className={styles.secondRow}>
                    {' '}
                    {/* 두 번째 줄: 메시지와 시간 */}
                    <span className={styles.notificationMessage}>
                      {notification.type === 'reply' ? notification.title : notification.message}
                    </span>
                    <span className={styles.notificationTime}>{formatTimeAgo(notification.created_at)}</span>
                  </div>
                  {!notification.is_read && ( // 읽지 않은 알림에만 붉은 뱃지 표시
                    <span className={styles.unreadBadge}></span>
                  )}
                </li>
              ))
            )}
          </ul>
          <div className={styles.buttonWrapper}>
            <Button
              onClick={handleNotificationSettingsClick}
              variant="primaryWhite"
              size="small"
              borderRadius="8"
              className={styles.settingsButton}
            >
              알림 설정
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
