'use client'

import React, { useEffect, useRef, useState } from 'react'
import './TownRegisterPage.css' // CSS 따로 분리

export default function TownRegisterPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [keyword, setKeyword] = useState('')
  const [town, setTown] = useState<string | null>(null)

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    })

    const geocoder = new window.kakao.maps.services.Geocoder()
    const marker = new window.kakao.maps.Marker({ map })

    window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
      const latlng = mouseEvent.latLng
      marker.setPosition(latlng)

      geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const townName = result[0].region_3depth_name
          setTown(townName)
        }
      })
    })

    if (keyword) {
      const ps = new window.kakao.maps.services.Places()
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const first = data[0]
          const latlng = new window.kakao.maps.LatLng(first.y, first.x)

          map.setCenter(latlng)
          marker.setPosition(latlng)

          geocoder.coord2RegionCode(first.x, first.y, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const townName = result[0].region_3depth_name
              setTown(townName)
            }
          })
        }
      })
    }
  }, [keyword])

  return (
    <main className="town-register-page">
      <h1 className="title">내 동네 등록하기</h1>

      <input
        type="text"
        placeholder="주소 검색 (예: 서울 강남역)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-input"
      />

      <div ref={mapRef} className="map-container" />

      {town && <p className="selected-town">선택된 동네: {town}</p>}
    </main>
  )
}
