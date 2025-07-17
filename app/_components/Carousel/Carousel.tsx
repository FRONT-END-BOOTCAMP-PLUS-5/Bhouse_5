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
          width: `${items.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / items.length)}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {items.map((item, index) => {
          const content = (
            <div key={index} className={styles.carouselItem} style={{ cursor: item.href ? 'pointer' : 'default' }}>
              {item.content}
            </div>
          )

          return item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              style={{ display: 'block', width: '100%', height: '100%' }}
            >
              {content}
            </a>
          ) : (
            content
          )
        })}
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
