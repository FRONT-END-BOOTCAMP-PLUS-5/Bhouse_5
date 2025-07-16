'use client'

import { useEffect, useRef, useState } from 'react'
import { addTown, removeTown, fetchTowns, setPrimaryTown } from '@/_lib/town'
import styles from './TownRegister.module.css'

interface TownInfo {
  townName: string
  isPrimary: boolean
}

export default function TownRegisterPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null)
  const [selectedTown, setSelectedTown] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [townList, setTownList] = useState<TownInfo[]>([])
  const [isMapReady, setIsMapReady] = useState(false)

  // 지도 준비되었는지 확인
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.kakao?.maps && mapRef.current) {
        clearInterval(interval)
        setIsMapReady(true)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        })

        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
          draggable: true,
        })

        marker.setMap(map)
        markerRef.current = marker

        getAddressFromCoords(marker.getPosition())

        window.kakao.maps.event.addListener(marker, 'dragend', () => {
          getAddressFromCoords(marker.getPosition())
        })

        window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
          const latlng = mouseEvent.latLng
          marker.setPosition(latlng)
          getAddressFromCoords(latlng)
        })
      },
      () => {
        // 위치 추적 실패 시 기본값 사용
        const fallback = new window.kakao.maps.LatLng(37.5665, 126.978)
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: fallback,
          level: 3,
        })

        const marker = new window.kakao.maps.Marker({
          position: fallback,
          draggable: true,
        })

        marker.setMap(map)
        markerRef.current = marker

        getAddressFromCoords(fallback)
      },
    )
  }, [isMapReady])

  // 동네 목록 불러오기
  useEffect(() => {
    const initTowns = async () => {
      try {
        const towns = await fetchTowns()
        setTownList(towns)
      } catch {
        setTownList([])
      }
    }
    initTowns()
  }, [])

  const getAddressFromCoords = (latlng: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder()
    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name
        setSelectedTown({
          name: address,
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        })
      }
    })
  }

  const openAddressSearch = () => {
    if (townList.length >= 3) {
      alert('동네는 최대 3개까지 등록할 수 있습니다.')
      return
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const regionAddress = `${data.sido} ${data.sigungu}` // 예: "부산광역시 서구"

        const geocoder = new window.kakao.maps.services.Geocoder()
        geocoder.addressSearch(regionAddress, function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
            const map = markerRef.current.getMap()

            map.setCenter(coords)
            markerRef.current.setPosition(coords)

            setSelectedTown({
              name: regionAddress, // "구" 단위까지만 저장
              lat: coords.getLat(),
              lng: coords.getLng(),
            })
          }
        })
      },
    }).open()
  }

  const handleRegister = async () => {
    if (!selectedTown) return
    try {
      await addTown({
        townName: selectedTown.name,
        lat: selectedTown.lat,
        lng: selectedTown.lng,
      })
      const updated = await fetchTowns()
      setTownList(updated)
      alert('동네가 등록되었습니다.')
      setSelectedTown(null) // 등록 후 초기화
    } catch (error) {
      console.error('동네 등록 에러:', error)
      alert('동네 등록 실패!')
    }
  }

  const handleDelete = async (townName: string) => {
    await removeTown(townName)
    const updated = await fetchTowns()
    setTownList(updated)
  }

  const handlePrimary = async (townName: string) => {
    await setPrimaryTown(townName)
    const updated = await fetchTowns()
    setTownList(updated)
  }

  return (
    <div className={styles.page}>
      <h2>내 동네 등록하기</h2>

      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: 400,
          borderRadius: 8,
          marginBottom: 16,
          border: '1px solid #ccc',
        }}
      />

      <button
        onClick={openAddressSearch}
        disabled={townList.length >= 3}
        style={{
          padding: '8px 16px',
          marginBottom: '1rem',
          borderRadius: 6,
          backgroundColor: townList.length >= 3 ? '#ccc' : '#007aff',
          color: '#fff',
          border: 'none',
          cursor: townList.length >= 3 ? 'not-allowed' : 'pointer',
        }}
      >
        + 내 동네 추가
      </button>

      {selectedTown && (
        <div className={styles.townInfo}>
          <p>
            <strong>선택한 위치:</strong> {selectedTown.name}
          </p>
          <button onClick={handleRegister}>이 위치를 내 동네로 등록</button>
        </div>
      )}

      <h3>📌 등록된 내 동네</h3>
      {townList.length === 0 ? (
        <p>아직 등록된 동네가 없습니다.</p>
      ) : (
        <ul>
          {townList.map((town) => (
            <li key={town.townName} className={styles.townItem}>
              {town.townName} {town.isPrimary && <strong>(대표)</strong>}
              <button onClick={() => handlePrimary(town.townName)}>대표로 설정</button>
              <button onClick={() => handleDelete(town.townName)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
