'use client'

import Script from 'next/script'

export default function KakaoMapLoader() {
  return (
    <Script
      strategy="beforeInteractive"
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services`}
    />
  )
}
