// app/layout.tsx
import './globals.css'
import Header from './_components/Header/Header'
import Footer from './_components/Footer/Footer'
import ScriptLoader from './_components/ScriptLoader/ScriptLoader'
import React from 'react'
import { QueryProvider } from 'providers/query.provider'

export const metadata = {
  title: 'My App',
  description: 'A boardgame platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ScriptLoader />
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
