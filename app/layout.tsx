'use client'

import { Roboto } from 'next/font/google'
import { QueryProvider } from 'providers/query.provider'
import './globals.css'
import { ReactNode } from 'react'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
