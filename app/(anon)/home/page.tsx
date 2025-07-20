// app/home/page.tsx
'use client' // 클라이언트 컴포넌트로 지정

import React from 'react'
import Carousel from '@/_components/Carousel/Carousel'
import BoardgameList from './_components/BoardgameList' // BoardgameList 컴포넌트 경로
import PostList from './_components/PostList' // PostList 컴포넌트 경로
import globalCss from '@/page.module.css' // app/page.module.css 임포트 (이름 변경)
import styles from './homePage.module.css' // 새로 생성된 homePage.module.css 임포트
import Image from 'next/image' // Image 컴포넌트를 사용하기 위해 임포트합니다.

export default function TestBoardgamesPage() {
  return (
    <main className={globalCss.page}>
      {/* app/page.module.css의 .page 스타일 적용 */}
      <div className={styles.container}>
        {' '}
        {/* Tailwind 클래스 대신 CSS 모듈 클래스 적용 */}
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
              href: '/boardgames', //FIXME : 보드게임 링크 구현후 수정
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
        {/* <BoardgameList /> */}
        <PostList />
      </div>
    </main>
  )
}
