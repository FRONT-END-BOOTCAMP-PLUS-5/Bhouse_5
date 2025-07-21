'use client'

import { useEffect, useRef, useState } from 'react'
import { addTown, removeTown, fetchTowns, setPrimaryTown, extractDistrictName } from 'models/services/town.service'
import styles from './TownRegister.module.css'
import Button from '@/_components/Button/Button'
import TownList from './_components/TownList'
import { usePolygonManager } from './_components/PolygonManager'

interface TownInfo {
  name: string
  isPrimary: boolean
}

export default function TownRegisterPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null)
  const [selectedTown, setSelectedTown] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [townList, setTownList] = useState<TownInfo[]>([])
  const [isMapReady, setIsMapReady] = useState(false)
  const [polygon, setPolygon] = useState<any>(null)
  const [polygonList, setPolygonList] = useState<any[]>([])
  const [primaryMarker, setPrimaryMarker] = useState<any>(null)
  const [primaryTownName, setPrimaryTownName] = useState<string | null>(null)
  const [primaryPolygon, setPrimaryPolygon] = useState<any>(null)

  const { handleDrawDistrictPolygon } = usePolygonManager({
    markerRef,
    polygonList,
    setPolygonList,
    primaryPolygon,
    setPrimaryPolygon,
    primaryMarker,
    setPrimaryMarker,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.kakao?.maps && mapRef.current) {
        clearInterval(interval)
        setIsMapReady(true)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    const initializeMap = async () => {
      try {
        // First, try to get the primary town
        const towns = await fetchTowns()
        setTownList(towns) // 여기서 한 번만 설정
        const primaryTown = towns.find((town) => town.isPrimary)

        if (primaryTown) {
          setPrimaryTownName(primaryTown.name)
          // If there's a primary town, center map on it
          const geocoder = new window.kakao.maps.services.Geocoder()
          geocoder.addressSearch(primaryTown.name, function (result: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
              createMapWithCenter(coords)
              // 지도 생성 후 대표 동네 폴리곤 그리기
              setTimeout(() => {
                handleDrawDistrictPolygon(primaryTown.name, true)
              }, 500)
            } else {
              // If geocoding fails, fall back to user location
              initializeWithUserLocation()
            }
          })
        } else {
          // No primary town, use user location
          initializeWithUserLocation()
        }
      } catch {
        // If fetching towns fails, fall back to user location
        initializeWithUserLocation()
      }
    }

    const createMapWithCenter = (center: any) => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: center,
        level: 3,
      })

      const marker = new window.kakao.maps.Marker({
        position: center,
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
    }

    const initializeWithUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const coords = new window.kakao.maps.LatLng(latitude, longitude)
          createMapWithCenter(coords)
        },
        () => {
          // Fallback to Seoul if geolocation fails
          const fallback = new window.kakao.maps.LatLng(37.5665, 126.978)
          createMapWithCenter(fallback)
        },
      )
    }

    initializeMap()
  }, [isMapReady])

  useEffect(() => {
    if (!selectedTown) return () => {} // Return empty cleanup function

    const districtName = extractDistrictName(selectedTown.name)

    // ✅ 선택한 동네가 대표 동네면 일반 폴리곤만 지움 (대표 동네는 유지)
    if (districtName === primaryTownName) {
      // 일반 폴리곤만 제거하고 대표 동네 폴리곤은 유지
      polygonList.forEach((p) => p.setMap(null))
      return () => {} // Return empty cleanup function for consistency
    }

    // setTimeout으로 폴리곤 그리기를 지연시켜 중복 호출 방지
    const timer = setTimeout(() => {
      handleDrawDistrictPolygon(districtName, false)
    }, 100)

    return () => clearTimeout(timer)
  }, [selectedTown, primaryTownName])

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
        const regionAddress = `${data.sido} ${data.sigungu}`
        const geocoder = new window.kakao.maps.services.Geocoder()
        geocoder.addressSearch(regionAddress, function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
            const map = markerRef.current.getMap()

            map.setCenter(coords)
            markerRef.current.setPosition(coords)

            setSelectedTown({
              name: regionAddress,
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
      const districtName = extractDistrictName(selectedTown.name)
      const currentTowns = await fetchTowns()
      const isDuplicate = currentTowns.some((town) => town.name === districtName)

      if (isDuplicate) {
        alert('이미 등록된 동네입니다.')
        return
      }

      await addTown({ townName: districtName, lat: selectedTown.lat, lng: selectedTown.lng })
      await handleDrawDistrictPolygon(districtName, false)
      const updated = await fetchTowns()
      setTownList(updated)
      alert('동네가 등록되었습니다.')
      setSelectedTown(null)
    } catch (error) {
      console.error('동네 등록 에러:', error)
      alert('동네 등록 실패!')
    }
  }

  const handleDelete = async (townName: string) => {
    await removeTown(townName)
    if (polygon) polygon.setMap(null)
    if (primaryMarker) primaryMarker.setMap(null)
    const updated = await fetchTowns()
    setTownList(updated)
  }

  const handlePrimary = async (townName: string) => {
    try {
      await setPrimaryTown(townName) // 서버 요청
      const updatedList = townList.map((town) => ({
        ...town,
        isPrimary: town.name === townName,
      }))
      setTownList(updatedList) // 즉시 로컬 상태 반영
      setPrimaryTownName(townName) // 대표 동네 이름 업데이트
      await handleDrawDistrictPolygon(townName, true) // 대표 동네 폴리곤 그리기
    } catch (e) {
      console.error('대표 설정 실패', e)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.header48}>내 동네 등록하기</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <Button onClick={openAddressSearch} disabled={townList.length >= 3}>
          + 주소 검색
        </Button>
      </div>

      <div
        ref={mapRef}
        style={{ width: '100%', height: 400, borderRadius: 8, marginBottom: 16, border: '1px solid #ccc' }}
      />

      {selectedTown && (
        <div className={styles.townInfo} style={{ textAlign: 'center', marginTop: 16 }}>
          <p>
            <strong>선택한 위치:</strong> {selectedTown.name}
          </p>
          <button
            onClick={handleRegister}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              backgroundColor: '#007aff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            이 위치를 내 동네로 등록하기
          </button>
        </div>
      )}

      <TownList townList={townList} onSetPrimary={handlePrimary} onDelete={handleDelete} />
    </div>
  )
}
