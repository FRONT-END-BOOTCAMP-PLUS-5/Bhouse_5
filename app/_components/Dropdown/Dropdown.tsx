'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import styles from './Dropdown.module.css'
import Button from '../Button/Button'

interface DropdownProps {
  /** 드롭다운의 기본 표시 값 */
  label: React.ReactNode
  /** 드롭다운 내용 (ul 태그 안의 li 또는 Button 등) */
  children: React.ReactNode
  /** 채우기 색상 (기본값: 회색) */
  fillColor?: string
  /** 둥글기 정도 (8, 12, 16, 20, 60 피그마 기준) */
  borderRadius?: '8' | '12' | '16' | '20' | '60'
  /** 드롭다운이 열렸을 때 최대 높이 (선택 사항) */
  maxHeight?: string
  /** 드롭다운의 크기를 정의합니다. 'small' 또는 기본 크기 (undefined)를 가집니다. */
  size?: 'small'
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  children,
  fillColor = '#F2F2F2',
  borderRadius = '8',
  maxHeight,
  size,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownListRef = useRef<HTMLUListElement>(null)
  const [dropdownListWidth, setDropdownListWidth] = useState('auto')

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

  // 드롭다운 리스트 너비 계산 (DOM 변경 후 즉시 실행)
  useLayoutEffect(() => {
    if (isOpen && dropdownListRef.current && dropdownRef.current) {
      // 1. 드롭다운 헤더의 실제 너비를 측정합니다.
      const headerElement = dropdownRef.current.querySelector(`.${styles.dropdownHeader}`) as HTMLElement
      const headerActualWidth = headerElement ? headerElement.offsetWidth : 0

      // maxWidth를 헤더 너비로 매번 초기화하여 이전 값 누적 방지
      let calculatedMaxWidth = headerActualWidth

      // 2. 드롭다운 리스트 아이템들 중 가장 넓은 너비를 찾습니다.
      Array.from(dropdownListRef.current.children).forEach((child) => {
        const childElement = child as HTMLElement
        let itemWidth = childElement.offsetWidth

        // Button 컴포넌트가 Dropdown List Item 안에 있는 경우, Button 자체의 너비를 측정합니다.
        // Dropdown에서 Button에 styles.buttonAsListItem 클래스를 추가했으므로 이를 활용할 수 있습니다.
        const buttonInsideLi = childElement.querySelector(`.${styles.buttonAsListItem}`)
        if (buttonInsideLi) {
          // 버튼의 실제 너비를 측정하고, 그 너비에 li의 padding을 더합니다.
          // 현재 buttonAsListItem에 margin이 10px 들어가 있으므로, 그 값을 반영합니다.
          const buttonActualWidth = (buttonInsideLi as HTMLElement).offsetWidth
          // DropdownList li의 padding: 10px 15px;
          // buttonAsListItem의 margin: 10px; (상하좌우 모두 10px로 가정)
          // 따라서 버튼 너비 + 좌우 마진 20px + li의 좌우 패딩 30px이 총 너비가 될 수 있습니다.
          // 또는 간단히 buttonElement.offsetWidth + li의 좌우 패딩만 고려할 수도 있습니다.
          // 여기서는 buttonAsListItem에 width: auto; margin: 10px; 이므로
          // 리스트 아이템의 패딩(15px*2) + 버튼의 너비를 더해주는 것이 정확할 수 있습니다.
          // 하지만 offsetWidth가 패딩과 보더를 포함하므로, 리스트 아이템 자체의 offsetWidth가 가장 정확할 수 있습니다.
          // 여기서는 li의 offsetWidth를 그대로 사용합니다.
          itemWidth = childElement.offsetWidth // li 전체의 offsetWidth 사용
        }

        if (itemWidth > calculatedMaxWidth) {
          calculatedMaxWidth = itemWidth
        }
      })

      // 3. 드롭다운 리스트 래퍼의 테두리 두께 (좌우 각 1px씩)를 고려합니다.
      const wrapperBorderWidth = 2 // 1px left + 1px right border from .dropdownListWrapper

      // 4. 최종 계산된 너비에 약간의 여유 공간을 더해줍니다 (안정성).
      const safeBuffer = size === 'small' ? 3 : 5 // small일 때 버퍼를 3px로 줄임

      const finalCalculatedWidth = calculatedMaxWidth + wrapperBorderWidth + safeBuffer

      // 계산된 너비가 0보다 큰 경우에만 업데이트 (초기 렌더링 시 0이 될 수 있으므로)
      if (finalCalculatedWidth > 0 && dropdownListWidth !== `${finalCalculatedWidth}px`) {
        setDropdownListWidth(`${finalCalculatedWidth}px`)
      }
    } else if (!isOpen) {
      // 드롭다운이 닫힐 때는 너비를 자동으로 설정하여 다음 열림 시 정확한 재계산을 유도
      setDropdownListWidth('auto')
    }
  }, [isOpen, children, label, size]) // label 변경 시에도 너비 재계산

  const dropdownStyle = {
    '--dropdown-fill-color': fillColor,
    '--dropdown-border-radius': `${borderRadius}px`,
    '--dropdown-max-height': maxHeight || 'none',
    '--dropdown-list-calculated-width': dropdownListWidth,
  } as React.CSSProperties

  const containerClasses = [styles.dropdownContainer, size === 'small' ? styles.small : ''].filter(Boolean).join(' ')

  return (
    <div className={containerClasses} ref={dropdownRef} style={dropdownStyle}>
      <button className={styles.dropdownHeader} onClick={toggleDropdown}>
        <span className={styles.labelContent}>{label}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}></span>
      </button>
      {isOpen && (
        <div className={styles.dropdownListWrapper}>
          <ul className={styles.dropdownList} ref={dropdownListRef}>
            {children}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown
