import './globals.css' // 전역 CSS
import Header from './_components/Header/Header' // Header 컴포넌트 임포트
import React from 'react'
import '@fortawesome/fontawesome-free/js/all.js'

export const metadata = {
  title: '보드의 집',
  description: '보드게임 동네 커뮤니티',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header /> {/* 여기에 Header 컴포넌트 추가 */}
        {children}
        {/* 페이지 내용은 main 태그로 감싸는 것이 좋습니다. */}
      </body>
    </html>
  )
}
