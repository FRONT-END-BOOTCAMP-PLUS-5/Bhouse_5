import React, { useState, useRef, useEffect, useLayoutEffect } from 'react' // useLayoutEffect 추가
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
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  children,
  fillColor = '#F2F2F2',
  borderRadius = '8',
  maxHeight,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownListRef = useRef<HTMLUListElement>(null)
  const [dropdownListWidth, setDropdownListWidth] = useState('auto')

  const toggleDropdown = () => {
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

  // useLayoutEffect는 DOM 변경 후 즉시 동기적으로 실행되어 정확한 측정에 유리합니다.
  useLayoutEffect(() => {
    if (isOpen && dropdownListRef.current && dropdownRef.current) {
      let maxWidth = 0

      // 1. 드롭다운 헤더의 실제 너비를 측정합니다.
      const headerElement = dropdownRef.current.querySelector(`.${styles.dropdownHeader}`) as HTMLElement
      const headerActualWidth = headerElement ? headerElement.offsetWidth : 0
      maxWidth = headerActualWidth // 일단 헤더 너비를 초기 최댓값으로 설정

      // 2. 드롭다운 리스트 아이템들 중 가장 넓은 너비를 찾습니다.
      Array.from(dropdownListRef.current.children).forEach((child) => {
        // child.offsetWidth는 요소의 레이아웃 너비를 반환하며, 패딩과 테두리를 포함합니다.
        const childWidth = (child as HTMLElement).offsetWidth

        if (childWidth > maxWidth) {
          maxWidth = childWidth
        }
      })

      // 3. 드롭다운 리스트 래퍼의 테두리 두께 (좌우 각 1px씩)를 고려합니다.
      const wrapperBorderWidth = 2 // 1px left + 1px right border from .dropdownListWrapper

      // 4. 최종 계산된 너비에 약간의 여유 공간을 더해줍니다 (안정성).
      const safeBuffer = 5 // 추가적인 여유 공간

      const finalCalculatedWidth = maxWidth + wrapperBorderWidth + safeBuffer
      setDropdownListWidth(`${finalCalculatedWidth}px`)
    } else if (!isOpen) {
      setDropdownListWidth('auto') // 드롭다운이 닫힐 때는 너비를 자동으로 설정
    }
  }, [isOpen, children]) // isOpen 상태 또는 자식(리스트 아이템)이 변경될 때마다 실행

  const dropdownStyle = {
    '--dropdown-fill-color': fillColor,
    '--dropdown-border-radius': `${borderRadius}px`,
    '--dropdown-max-height': maxHeight || 'none',
    '--dropdown-list-calculated-width': dropdownListWidth, // 계산된 리스트 너비 CSS 변수로 전달
  } as React.CSSProperties

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef} style={dropdownStyle}>
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
