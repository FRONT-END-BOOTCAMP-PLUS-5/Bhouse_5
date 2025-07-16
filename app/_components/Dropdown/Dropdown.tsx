// Dropdown.tsx
'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import styles from './Dropdown.module.css'
import Button from '../Button/Button' // Button 컴포넌트 임포트 확인

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
  /** 드롭다운 리스트의 배경색 (선택 사항) */
  listBgColor?: string // 새로운 prop 추가
  /** 드롭다운 리스트의 모서리 둥근 정도 (선택 사항) */
  listBorderRadius?: '8' | '12' | '16' | '20' | '60' | string // 새로운 prop 추가 (string으로 확장하여 유연성 확보)
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  children,
  fillColor = '#F2F2F2', //
  borderRadius = '8', //
  maxHeight,
  size,
  listBgColor, // 새로운 prop
  listBorderRadius, // 새로운 prop
}) => {
  const [isOpen, setIsOpen] = useState(false) //
  const dropdownRef = useRef<HTMLDivElement>(null) //
  const dropdownListRef = useRef<HTMLUListElement>(null) //
  const [dropdownListWidth, setDropdownListWidth] = useState('auto') //

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev) //
  }

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        //
        setIsOpen(false) //
      }
    }

    document.addEventListener('mousedown', handleClickOutside) //
    return () => {
      document.removeEventListener('mousedown', handleClickOutside) //
    }
  }, []) //

  // 드롭다운 리스트 너비 계산 (DOM 변경 후 즉시 실행)
  useLayoutEffect(() => {
    if (isOpen && dropdownListRef.current && dropdownRef.current) {
      //
      const headerElement = dropdownRef.current.querySelector(`.${styles.dropdownHeader}`) as HTMLElement //
      const headerActualWidth = headerElement ? headerElement.offsetWidth : 0 //

      let calculatedMaxWidth = headerActualWidth //

      Array.from(dropdownListRef.current.children).forEach((child) => {
        //
        const childElement = child as HTMLElement //
        let itemWidth = childElement.offsetWidth //

        const buttonInsideLi = childElement.querySelector(`.${styles.buttonAsListItem}`) //
        if (buttonInsideLi) {
          //
          itemWidth = childElement.offsetWidth //
        }

        if (itemWidth > calculatedMaxWidth) {
          //
          calculatedMaxWidth = itemWidth //
        }
      })

      const wrapperBorderWidth = 2 //
      const safeBuffer = size === 'small' ? 3 : 5 //

      const finalCalculatedWidth = calculatedMaxWidth + wrapperBorderWidth + safeBuffer //

      if (finalCalculatedWidth > 0 && dropdownListWidth !== `${finalCalculatedWidth}px`) {
        //
        setDropdownListWidth(`${finalCalculatedWidth}px`) //
      }
    } else if (!isOpen) {
      //
      setDropdownListWidth('auto') //
    }
  }, [isOpen, children, label, size]) //

  const dropdownStyle = {
    '--dropdown-fill-color': fillColor, //
    '--dropdown-border-radius': `${borderRadius}px`, //
    '--dropdown-max-height': maxHeight || 'none', //
    '--dropdown-list-calculated-width': dropdownListWidth, //
    // 새로운 CSS 변수 추가
    '--dropdown-list-bg-color': listBgColor || 'var(--primary-white)', // 기본값은 흰색
    '--dropdown-list-border-radius': listBorderRadius ? `${listBorderRadius}px` : 'var(--dropdown-border-radius)', // 기본값은 헤더와 동일
  } as React.CSSProperties

  const containerClasses = [styles.dropdownContainer, size === 'small' ? styles.small : ''].filter(Boolean).join(' ') //

  return (
    <div className={containerClasses} ref={dropdownRef} style={dropdownStyle}>
      <button className={styles.dropdownHeader} onClick={toggleDropdown}>
        <span className={styles.labelContent}>{label}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}></span>
      </button>
      {isOpen && (
        <div className={styles.dropdownListWrapper}>
          <ul className={styles.dropdownList} ref={dropdownListRef}>
            {/* children을 맵핑하여 Button 컴포넌트에 특정 클래스 추가 및 li hover 방지 */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === Button) {
                //
                return (
                  <li className={styles.noHoverBackground}>
                    {' '}
                    {/* 버튼을 감싸는 li에 클래스 추가 */}
                    {child}
                  </li>
                )
              }
              return child
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown
