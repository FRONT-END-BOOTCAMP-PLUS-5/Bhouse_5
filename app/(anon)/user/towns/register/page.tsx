'use client'

import { useEffect, useRef, useState } from 'react'
import { addTown, removeTown, fetchTowns, setPrimaryTown, extractDistrictName, normalizeSidoName } from '@/_lib/town'
import styles from './TownRegister.module.css'
import Button from '@/_components/Button/Button'

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
  const [polygonList, setPolygonList] = useState<window.kakao.maps.Polygon[]>([])
  const [primaryMarker, setPrimaryMarker] = useState<any>(null)
  const [primaryTownName, setPrimaryTownName] = useState<string | null>(null)
  const [primaryPolygon, setPrimaryPolygon] = useState<window.kakao.maps.Polygon | null>(null)
  const [searchOptions, setSearchOptions] = useState<string[]>([])

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

  useEffect(() => {
    const initTowns = async () => {
      try {
        const towns = await fetchTowns()
        setTownList(towns)
        setSearchOptions(Array.from(new Set(towns.map((t) => t.name))))

        const primary = towns.find((t) => t.isPrimary)
        if (primary) {
          setPrimaryTownName(primary.name)
          await handleDrawDistrictPolygon(primary.name, true)
        }
      } catch {
        setTownList([])
      }
    }
    initTowns()
  }, [])

  useEffect(() => {
    if (selectedTown) {
      const districtName = extractDistrictName(selectedTown.name)

      // ✅ 선택한 동네가 대표 동네면 파란색 지움
      if (districtName === primaryTownName) {
        polygonList.forEach((p) => p.setMap(null))
        setPolygonList([])
        return
      }

      handleDrawDistrictPolygon(districtName, false)
    }
  }, [selectedTown])

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

  const handleDrawDistrictPolygon = async (districtName: string, isPrimary = false) => {
    try {
      const sido = districtName.split(' ')[0]
      const fullSido = normalizeSidoName(sido)
      const geoJsonUrl = `/geojson/hangjeongdong_${fullSido}.geojson`
      const res = await fetch(geoJsonUrl)
      const geojson = await res.json()

      const clean = (str: string) => str.normalize('NFC').replace(/\s+/g, ' ').trim()
      const features = geojson.features.filter((f: any) => clean(f.properties.adm_nm).startsWith(clean(districtName)))
      if (!features || features.length === 0) return

      if (isPrimary) {
        if (primaryPolygon) primaryPolygon.setMap(null)
        if (primaryMarker) primaryMarker.setMap(null)
      } else {
        polygonList.forEach((p) => p.setMap(null))
        setPolygonList([])
      }

      const paths: window.kakao.maps.LatLng[][] = []
      features.forEach((feature) => {
        const coordinatesList = feature.geometry.coordinates
        if (feature.geometry.type === 'Polygon') {
          paths.push(coordinatesList[0].map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)))
        } else if (feature.geometry.type === 'MultiPolygon') {
          coordinatesList.forEach((polygonCoords) => {
            paths.push(polygonCoords[0].map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)))
          })
        }
      })

      const polygon = new window.kakao.maps.Polygon({
        path: paths,
        strokeWeight: 2,
        strokeColor: isPrimary ? '#ff8800' : '#007aff',
        strokeOpacity: 0.8,
        fillColor: isPrimary ? '#ffd699' : '#a3c8ff',
        fillOpacity: 0.3,
      })

      polygon.setMap(markerRef.current.getMap())

      if (isPrimary) {
        setPrimaryPolygon(polygon)

        // 대표 마커 추가
        const flat = paths.flat()
        const center = flat.reduce(
          (acc, curr) => ({
            lat: acc.lat + curr.getLat(),
            lng: acc.lng + curr.getLng(),
          }),
          { lat: 0, lng: 0 },
        )

        const avg = new window.kakao.maps.LatLng(center.lat / flat.length, center.lng / flat.length)

        const image = new window.kakao.maps.MarkerImage(
          '/icons/primary_marker.svg',
          new window.kakao.maps.Size(32, 32),
          { offset: new window.kakao.maps.Point(16, 16) },
        )

        const starMarker = new window.kakao.maps.Marker({
          position: avg,
          image,
          title: '대표 동네',
        })

        starMarker.setMap(markerRef.current.getMap())
        setPrimaryMarker(starMarker)
      } else {
        setPolygonList((prev) => [...prev, polygon])
      }
    } catch (err) {
      console.error('폴리곤 렌더링 실패:', err)
    }
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
    await setPrimaryTown(townName)
    setPrimaryTownName(townName)
    await handleDrawDistrictPolygon(townName, true)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.header48}>내 동네 등록하기</h2>

      {/* 🔍 검색창, 자동완성, 버튼 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        {/* <input
          type="text"
          list="townSuggestions"
          placeholder="동네 이름 검색 (예: 서울 강남구)"
          onChange={(e) => {
            const value = e.target.value.trim()
            if (value) localStorage.setItem('lastSearchTown', value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const query = (e.target as HTMLInputElement).value.trim()
              if (!query) return

              const geocoder = new window.kakao.maps.services.Geocoder()
              geocoder.addressSearch(query, function (result: any, status: any) {
                if (status === window.kakao.maps.services.Status.OK) {
                  const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
                  const map = markerRef.current.getMap()

                  map.setCenter(coords)
                  markerRef.current.setPosition(coords)

                  setSelectedTown({
                    name: query,
                    lat: coords.getLat(),
                    lng: coords.getLng(),
                  })
                } else {
                  alert('해당 동네를 찾을 수 없습니다.')
                }
              })
            }
          }}
          style={{
            width: '100%',
            maxWidth: 300,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 14,
          }}
        />
        <datalist id="townSuggestions">
          {searchOptions.map((town) => (
            <option key={town} value={town} />
          ))}
        </datalist> */}
        <Button onClick={openAddressSearch} disabled={townList.length >= 3}>
          + 주소 검색
        </Button>
      </div>

      {/* {typeof window !== 'undefined' && localStorage.getItem('lastSearchTown') && (
        <div style={{ fontSize: 13, marginBottom: 8, color: '#888' }}>
          최근 검색어: <strong>{localStorage.getItem('lastSearchTown')}</strong>
        </div>
      )} */}

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

      <h3>📌 등록된 내 동네</h3>
      {townList.length === 0 ? (
        <p>아직 등록된 동네가 없습니다.</p>
      ) : (
        <ul>
          {townList.map((town) => (
            <li key={town.name} className={styles.townItem}>
              <span className={styles.townName}>
                {town.name}
                {town.isPrimary && <span className={styles.primaryTag}>(대표)</span>}
              </span>
              <div className={styles.buttonGroup}>
                <button onClick={() => handlePrimary(town.name)}>대표로 설정</button>
                <button onClick={() => handleDelete(town.name)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
