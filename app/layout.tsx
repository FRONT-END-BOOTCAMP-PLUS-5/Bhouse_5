'use client'

import { Roboto } from 'next/font/google'
import './globals.css'
import React from 'react'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
