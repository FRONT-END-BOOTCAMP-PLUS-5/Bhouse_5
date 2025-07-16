import './globals.css' // 전역 CSS
import Header from './_components/Header/Header' // Header 컴포넌트 임포트
import React from 'react'
import Footer from './_components/Footer/Footer' // 새로 만든 Footer 컴포넌트 경로
import ScriptLoader from './_components/ScriptLoader/ScriptLoader'

export const metadata = {
  title: '보드의 집',
  description: '보드게임 동네 커뮤니티',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ScriptLoader /> {/* kakao map api 로드 */}
        <Header /> {/* 여기에 Header 컴포넌트 추가 */}
        {children}
        <Footer />
      </body>
    </html>
  )
}
