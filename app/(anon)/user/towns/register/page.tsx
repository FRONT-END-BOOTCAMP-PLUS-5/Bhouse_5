'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './TownRegister.module.css'
import { addTown, removeTown, setPrimaryTown, fetchTowns } from '@/_lib/town'

interface TownInfo {
  name: string
  isPrimary: boolean
}

export default function TownRegisterPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerInstance = useRef<any>(null)

  const [keyword, setKeyword] = useState('')
  const [town, setTown] = useState<string | null>(null)
  const [townList, setTownList] = useState<TownInfo[]>([])

  // 🧭 지도 초기화 공통 함수
  const initMap = (lat: number, lng: number) => {
    if (!window.kakao || !mapRef.current) return

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
    })
    mapInstance.current = map

    const marker = new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(lat, lng),
    })
    markerInstance.current = marker

    const geocoder = new window.kakao.maps.services.Geocoder()
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const townName = result[0].region_3depth_name
        setTown(townName)
      }
    })

    // 지도 클릭 이벤트 → 마커 이동 및 주소 업데이트
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
  }

  // ✅ 지도 및 현재 위치 설정
  useEffect(() => {
    const loadMap = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => initMap(pos.coords.latitude, pos.coords.longitude),
        () => initMap(37.5665, 126.978), // 서울시청 기본값
        { enableHighAccuracy: true, timeout: 5000 },
      )
    }

    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(loadMap)
    } else {
      const intv = setInterval(() => {
        if (window.kakao?.maps?.load) {
          clearInterval(intv)
          window.kakao.maps.load(loadMap)
        }
      }, 100)
    }
  }, [])

  // 🔄 등록된 동네 불러오기
  useEffect(() => {
    fetchTowns()
      .then(setTownList)
      .catch((err) => console.error('동네 불러오기 실패:', err))
  }, [])

  // 🔍 주소 키워드 검색
  useEffect(() => {
    if (!keyword || !mapInstance.current || !markerInstance.current) return

    const ps = new window.kakao.maps.services.Places()
    const geocoder = new window.kakao.maps.services.Geocoder()

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const first = data[0]
        const latlng = new window.kakao.maps.LatLng(Number(first.y), Number(first.x))

        mapInstance.current?.setCenter(latlng)
        markerInstance.current?.setPosition(latlng)

        geocoder.coord2RegionCode(first.x, first.y, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const townName = result[0].region_3depth_name
            setTown(townName)
          }
        })
      }
    })
  }, [keyword])

  useEffect(() => {
    console.log(window, window.kakao) // 여기에 자동완성 떠야 정상
  }, [])

  // ➕ 동네 등록
  const handleRegister = () => {
    if (townList.length >= 3) {
      alert('최대 3개까지 등록 가능합니다.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const geocoder = new window.kakao.maps.services.Geocoder()

        geocoder.coord2RegionCode(lng, lat, async (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const townName = result[0].region_3depth_name
            try {
              await addTown({ townName, lat, lng })
              setTownList((prev) => [...prev, { name: townName, isPrimary: false }])
              setTown(townName)
              alert('등록 완료!')
            } catch (err) {
              alert('등록 실패: ' + (err as Error).message)
            }
          }
        })
      },
      () => alert('위치 정보를 가져올 수 없습니다.'),
      { enableHighAccuracy: true },
    )
  }

  const handleDelete = async (name: string) => {
    try {
      await removeTown(name)
      setTownList((prev) => prev.filter((t) => t.name !== name))
    } catch (err) {
      alert('삭제 실패: ' + (err as Error).message)
    }
  }

  const handlePrimary = async (name: string) => {
    try {
      await setPrimaryTown(name)
      setTownList((prev) =>
        prev.map((t) => ({
          ...t,
          isPrimary: t.name === name,
        })),
      )
    } catch (err) {
      alert('대표 동네 설정 실패: ' + (err as Error).message)
    }
  }

  return (
    <main className={styles.townRegisterPage}>
      <h1 className={styles.title}>내 동네 등록하기</h1>

      <input
        type="text"
        placeholder="주소 검색 (예: 서울 강남역)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className={styles.searchInput}
      />

      <div ref={mapRef} className={styles.mapContainer} />

      {town && (
        <div>
          <p className={styles.selectedTown}>선택된 동네: {town}</p>
          <button onClick={handleRegister} className={styles.registerButton}>
            등록하기
          </button>
        </div>
      )}

      <ul className={styles.townList}>
        {townList.map((t) => (
          <li key={t.name} className={styles.townItem}>
            <span className={t.isPrimary ? styles.primary : ''}>{t.name}</span>
            <div>
              {!t.isPrimary && <button onClick={() => handlePrimary(t.name)}>⭐ 대표</button>}
              <button onClick={() => handleDelete(t.name)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
