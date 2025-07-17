'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './AlarmDropdown.module.css' // 새로 생성할 CSS 모듈
import Button from '../Button/Button' // Button 컴포넌트 임포트

// 백엔드의 Alarm.ts enum을 참조하여 프론트엔드에 사용할 알림 타입 정의
export type AlarmType = 'KEYWORD' | 'REPLY' | 'ADMIN'

// 알림 데이터 타입 정의 (필요에 따라 별도 types 폴더로 분리 가능)
interface BaseAlarm {
  id: string
  is_read: boolean
  created_at: string // ISO string 또는 Date가 파싱할 수 있는 형식
  type: AlarmType // 모든 알림은 타입을 가집니다.
}

export interface KeywordAlarm extends BaseAlarm {
  type: 'KEYWORD' // 'KEYWORD' 타입임을 명시
  message: string
}

export interface ReplyAlarm extends BaseAlarm {
  type: 'REPLY' // 'REPLY' 타입임을 명시
  title: string
}

export interface AdminAlarm extends BaseAlarm {
  type: 'ADMIN' // 'ADMIN' 타입임을 명시
  message: string // 관리자 알림은 메시지를 가질 것으로 가정
}

export type Alarm = KeywordAlarm | ReplyAlarm | AdminAlarm

interface AlarmDropdownProps {
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

const AlarmDropdown: React.FC<AlarmDropdownProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // API로부터 올 데이터와 유사하게 하드코딩된 알림 데이터
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 'noti-1',
      type: 'REPLY', // 타입 변경: 'reply' -> 'REPLY'
      title: '새 답글 님이랑은 보드게임 안.gegegegegegege',
      is_read: false, // 안 읽음: 검은색, 붉은 뱃지
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3분 전
      //TODO(@채원) : post id 추가
    },
    {
      id: 'noti-2',
      type: 'KEYWORD', // 타입 변경: 'keyword' -> 'KEYWORD'
      message: '키워드 알림 마피아 2명만 더 오면...gegegegegegege',
      is_read: false, // 안 읽음: 검은색, 붉은 뱃지
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
    },
    {
      id: 'noti-3',
      type: 'KEYWORD', // 타입 변경: 'keyword' -> 'KEYWORD'
      message: '키워드 알림 제발와주세요급구gegegegegegegegegegegegegegegegegegegegege',
      is_read: true, // 읽음: 회색
      created_at: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 두 달 전
    },
    {
      id: 'noti-4',
      type: 'ADMIN', // 새로운 관리자 알림 더미 데이터 (읽지 않음)
      message: '시스템 점검으로 인해 잠시 서비스 이용이 제한됩니다.',
      is_read: false,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    },
    {
      id: 'noti-5',
      type: 'ADMIN', // 새로운 관리자 알림 더미 데이터 (읽음)
      message: '새로운 서비스 약관이 적용되었습니다. 확인해주세요.',
      is_read: true,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
    },
    {
      id: 'noti-6',
      type: 'REPLY',
      title: '다른 답글이 추가되었습니다.',
      is_read: false,
      created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1분 전
    },
    {
      id: 'noti-7',
      type: 'KEYWORD',
      message: '새로운 키워드 알림입니다.',
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2분 전
    },
  ])

  const unreadCount = alarms.filter((n) => !n.is_read).length // 읽지 않은 알림 개수 계산

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
    setAlarms((prev) => prev.map((noti) => ({ ...noti, is_read: true })))
    console.log('모든 알림 읽음 처리')
  }

  // 개별 알림 클릭 시 읽음으로 처리 및 동작
  const handleAlarmClick = (id: string) => {
    setAlarms((prev) => prev.map((noti) => (noti.id === id ? { ...noti, is_read: true } : noti)))
    console.log(`알림 ${id} 클릭됨`)
    // TODO: 알림 클릭 시 해당 상세 페이지로 이동하는 로직 추가
  }

  // 알림 설정 버튼 클릭 시 동작
  const handleAlarmSettingsClick = () => {
    console.log('알림 설정 버튼 클릭')
    // TODO: 알림 설정 페이지로 이동하는 로직 추가
  }

  return (
    <div className={styles.alarmDropdownContainer} ref={dropdownRef}>
      <div onClick={handleToggle} className={styles.triggerWrapper}>
        {trigger}
        {unreadCount > 0 && <span className={styles.unreadCountBadge}>{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className={styles.alarmDropdownListWrapper}>
          <div className={styles.headerRow}>
            <button onClick={handleMarkAllAsRead} className={styles.readAllText}>
              모두 읽기
            </button>
          </div>
          <ul className={styles.alarmList}>
            {alarms.length === 0 ? (
              <li className={styles.noAlarms}>새로운 알림이 없습니다.</li>
            ) : (
              // 최신 알림 4개만 표시하도록 정렬 및 슬라이스
              alarms
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // 최신순 정렬
                .slice(0, 4) // 최신 4개만 선택
                .map((alarm) => (
                  <li
                    key={alarm.id}
                    className={`${styles.alarmItem} ${alarm.is_read ? styles.read : styles.unread}`}
                    onClick={() => handleAlarmClick(alarm.id)}
                  >
                    <div className={styles.firstRow}>
                      <span className={styles.alarmType}>
                        {alarm.type === 'REPLY' && '새 댓글'}
                        {alarm.type === 'KEYWORD' && '키워드'}
                        {alarm.type === 'ADMIN' && '관리자'}
                      </span>
                    </div>
                    <div className={styles.secondRow}>
                      <span className={styles.alarmMessage}>
                        {alarm.type === 'REPLY' ? alarm.title : alarm.message}
                      </span>
                      <span className={styles.alarmTime}>{formatTimeAgo(alarm.created_at)}</span>
                    </div>
                    {!alarm.is_read && ( // 읽지 않은 알림에만 붉은 뱃지 표시
                      <span className={styles.unreadBadge}></span>
                    )}
                  </li>
                ))
            )}
          </ul>
          <div className={styles.buttonWrapper}>
            <Button
              onClick={handleAlarmSettingsClick}
              variant="secondaryWhite"
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

export default AlarmDropdown
