'use client'

import { useEffect, useRef, useState } from 'react'
import { addTown, removeTown, fetchTowns, setPrimaryTown } from '@/_lib/town'
import styles from './TownRegister.module.css'
import { extractDistrictName, normalizeSidoName } from '@utils/constants'

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
  const [polygon, setPolygon] = useState<any>(null)
  const [primaryMarker, setPrimaryMarker] = useState<window.kakao.maps.Marker | null>(null)
  const [primaryTownName, setPrimaryTownName] = useState<string | null>(null)

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

        const primary = towns.find((t) => t.isPrimary)
        if (primary) {
          setPrimaryTownName(primary.townName)
          await handleDrawDistrictPolygon(primary.townName, true)
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
      if (districtName !== primaryTownName) {
        handleDrawDistrictPolygon(districtName, false)
      }
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
      const features = geojson.features.filter((f) => clean(f.properties.adm_nm).startsWith(clean(districtName)))

      if (!features || features.length === 0) return
      if (!isPrimary && polygon) polygon.setMap(null)
      if (primaryMarker && isPrimary) primaryMarker.setMap(null)

      const paths: window.kakao.maps.LatLng[][] = []

      features.forEach((feature) => {
        const coordinatesList = feature.geometry.coordinates
        if (feature.geometry.type === 'Polygon') {
          paths.push(coordinatesList[0].map(([lng, lat]: number[]) => new window.kakao.maps.LatLng(lat, lng)))
        } else if (feature.geometry.type === 'MultiPolygon') {
          coordinatesList.forEach((polygonCoords: number[][][]) => {
            paths.push(polygonCoords[0].map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)))
          })
        }
      })

      const kakaoPolygon = new window.kakao.maps.Polygon({
        path: paths,
        strokeWeight: 2,
        strokeColor: isPrimary ? '#ff8800' : '#007aff',
        strokeOpacity: 0.8,
        fillColor: isPrimary ? '#ffd699' : '#a3c8ff',
        fillOpacity: 0.3,
      })

      kakaoPolygon.setMap(markerRef.current.getMap())
      if (!isPrimary) setPolygon(kakaoPolygon)

      if (isPrimary) {
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
      const isDuplicate = currentTowns.some((town) => town.townName === districtName)

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
    const updated = await fetchTowns()
    setTownList(updated)
  }

  return (
    <div className={styles.page}>
      <h2>내 동네 등록하기</h2>
      <div
        ref={mapRef}
        style={{ width: '100%', height: 400, borderRadius: 8, marginBottom: 16, border: '1px solid #ccc' }}
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
