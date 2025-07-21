// Carousel.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './Carousel.module.css'
import Link from 'next/link'

interface CarouselItem {
  content: React.ReactNode
  href?: string
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({ items, autoPlay = true, interval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoPlay) {
      timeoutRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
      }, interval)
    }
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [items.length, interval, autoPlay])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = useRef<number | null>(null)
  const handleTouchEnd = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    handleTouchStart.current = e.changedTouches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    handleTouchEnd.current = e.changedTouches[0].clientX
    if (handleTouchStart.current != null && handleTouchEnd.current != null) {
      const delta = handleTouchStart.current - handleTouchEnd.current
      if (delta > 50) {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      } else if (delta < -50) {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
      }
    }
  }

  return (
    <div className={styles.carouselContainer} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} ref={carouselRef}>
      <div
        className={styles.carouselTrack}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className={styles.carouselItemWrapper} style={{ width: '100%' }}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.carouselItemLink}>
                <div className={styles.carouselItem}>{item.content}</div>
              </a>
            ) : (
              <div className={styles.carouselItem}>{item.content}</div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.carouselDots}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  )
}
