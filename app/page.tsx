// app/home/page.tsx
'use client' // 클라이언트 컴포넌트로 지정

import React from 'react'
import Link from 'next/link' // Link 컴포넌트 임포트
import Carousel from './_components/Carousel/Carousel'
import HomeBoardgameList from './_components/HomeBoardgameList/HomeBoardgameList' // BoardgameList 컴포넌트 경로
import HomePostList from './_components/HomePostList/HomePostList' // PostList 컴포넌트 경로
import globalStyles from './page.module.css' // app/page.module.css 임포트 (이름 변경)
import styles from './homePage.module.css' // 새로 생성된 homePage.module.css 임포트
import Image from 'next/image' // Image 컴포넌트를 사용하기 위해 임포트합니다.

export default function TestBoardgamesPage() {
  return (
    <main className={globalStyles.page}>
      {/* app/page.module.css의 .page 스타일 적용 */}
      <div className={styles.container}>
        <Carousel
          items={[
            {
              content: (
                <Image
                  src="/images/banner1.png"
                  alt="Ad 1"
                  width={612}
                  height={408}
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
                  width={800}
                  height={300}
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
                  width={800}
                  height={300}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ),
              href: '/community/posts',
            },
          ]}
          autoPlay
          interval={10000}
        />

        {/* "지금 HOT한 보드게임" 섹션 헤더 */}
        <div className={styles.sectionHeader}>
          <h2 className={`${globalStyles.header20} ${styles.sectionTitle}`}>지금 HOT한 보드게임</h2>
          <Link href="/boardgames" className={styles.moreButton}>
            더보기
          </Link>
        </div>
        {/* <HomeBoardgameList /> */}

        {/* "커뮤니티" 섹션 헤더 */}
        <div className={styles.sectionHeader}>
          <h2 className={`${globalStyles.header20} ${styles.sectionTitle}`}>커뮤니티</h2>
          <Link href="/community/posts" className={styles.moreButton}>
            더보기
          </Link>
        </div>
        <HomePostList />
      </div>

    </main>
  )
}
