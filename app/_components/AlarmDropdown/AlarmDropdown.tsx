// src/components/AlarmDropdown/AlarmDropdown.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import styles from './AlarmDropdown.module.css'
import Button from '../Button/Button'

import { useGetAlarms, useMarkAlarmAsRead } from 'models/querys/alarm.query'
import { AlarmType, Alarm } from 'models/services/alarm.service'

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

interface AlarmDropdownProps {
  trigger: React.ReactNode
}

const AlarmDropdown: React.FC<AlarmDropdownProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 'ALL' 타입으로 알림을 가져오도록 useGetAlarms 호출 변경
  const { data: alarms = [], isLoading, isError, error } = useGetAlarms('ALL')
  const { mutate: markAlarmAsRead } = useMarkAlarmAsRead()

  const unreadCount = alarms.filter((n) => !n.is_read).length

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

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

  const handleMarkAllAsRead = () => {
    markAlarmAsRead({ markAll: true })
    console.log('모든 알림 읽음 처리 요청')
  }

  const handleAlarmClick = (id: string) => {
    markAlarmAsRead({ alarmId: id })
    console.log(`알림 ${id} 읽음 처리 요청`)
  }

  const handleAlarmSettingsClick = () => {
    router.push('/user/settings')
    setIsOpen(false) // 알림 설정 버튼 클릭 시 드롭다운 닫기
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
            {isLoading ? (
              <li className={styles.noAlarms}>알림을 불러오는 중...</li>
            ) : isError ? (
              <li className={styles.noAlarms}>알림을 불러오는데 실패했습니다.</li>
            ) : alarms.length === 0 ? (
              <li className={styles.noAlarms}>새로운 알림이 없습니다.</li>
            ) : (
              alarms
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 4)
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
                    {!alarm.is_read && <span className={styles.unreadBadge}></span>}
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
