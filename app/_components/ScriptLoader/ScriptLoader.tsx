'use client'

import Script from 'next/script'

export default function ScriptLoader() {
  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services,places`}
        strategy="afterInteractive"
        onLoad={() => {
          window.kakao.maps.load(() => {
            console.log('✅ Kakao Map SDK loaded')
            window.dispatchEvent(new Event('kakao:loaded'))
          })
        }}
      />
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Daum Postcode script loaded')
        }}
      />
    </>
  )
}
