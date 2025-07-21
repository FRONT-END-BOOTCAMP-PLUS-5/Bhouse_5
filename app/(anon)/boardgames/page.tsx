'use client'

import Divider from '@/_components/Divider/Divider'
import GameList from './_components/GameList'
import styles from './page.module.css'
import Carousel from '@/_components/Carousel/Carousel'
import Image from 'next/image' // Image 컴포넌트를 사용하기 위해 임포트합니다.

export default function BoardgameList() {
  return (
    <div className={styles.container}>
      <Carousel
        items={[
          {
            content: (
              <Image
                src="/images/banner1.png"
                alt="Ad 1"
                width={250}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ),
            href: '/store-register',
          },
          {
            content: (
              <Image
                src="/images/banner2.png"
                alt="Ad 3"
                width={250}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ),
            href: '/boardgames',
          },
          {
            content: (
              <Image
                src="/images/banner3.png"
                alt="Ad 3"
                width={250}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ),
            href: '/community/posts',
          },
        ]}
        autoPlay
        interval={10000}
      />
      <h1>보드게임 리스트</h1>
      <div className={styles.category}>전체/전략/추상/가족</div>
      <Divider />
      <div className={styles.headerRow}>
        <div className={styles.headerItem}>순위</div>
        <div className={styles.headerItem}>게임</div>
        <div className={styles.headerItem}>공간</div>
        <div className={styles.headerItem}>찜</div>
      </div>
      <GameList />
    </div>
  )
}
