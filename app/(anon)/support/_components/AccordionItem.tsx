// _components/AccordionItem/AccordionItem.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './AccordionItem.module.css'
import Image from 'next/image' // 화살표 아이콘을 위해 Image 컴포넌트 임포트

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  initialOpen?: boolean // 초기에 열려있을지 여부 (선택 사항)
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState('0px')

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [isOpen, children]) // isOpen 또는 children이 변경될 때 높이 재계산

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.accordionItem}>
      <button className={styles.accordionHeader} onClick={toggleAccordion}>
        <span className={styles.accordionTitle}>{title}</span>
        <Image
          src="/icons/arrow.svg" // 적절한 화살표 아이콘 경로로 변경해주세요
          alt="toggle"
          width={24}
          height={24}
          className={`${styles.arrowIcon} ${isOpen ? styles.open : ''}`}
        />
      </button>
      <div ref={contentRef} className={styles.accordionContent} style={{ maxHeight: contentHeight }}>
        <div className={styles.accordionBody}>{children}</div>
      </div>
    </div>
  )
}

export default AccordionItem
