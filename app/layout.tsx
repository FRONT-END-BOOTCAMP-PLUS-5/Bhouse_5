import './globals.css' // 전역 CSS
import Header from './_components/Header/Header' // Header 컴포넌트 임포트
import React from 'react'

// FontAwesome JavaScript 파일 임포트 (전역적으로 한 번만)
// 이 부분이 있어야 <i class="far fa-user"></i> 아이콘이 제대로 표시됩니다.
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
        <main>{children}</main> {/* 페이지 내용은 main 태그로 감싸는 것이 좋습니다. */}
      </body>
    </html>
  )
}
