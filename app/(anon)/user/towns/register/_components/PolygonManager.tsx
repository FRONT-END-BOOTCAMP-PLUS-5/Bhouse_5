'use client'

import React, { useCallback } from 'react'
import { normalizeSidoName } from 'models/services/town.service'

interface PolygonManagerProps {
  markerRef: React.MutableRefObject<any>
  polygonList: window.kakao.maps.Polygon[]
  setPolygonList: React.Dispatch<React.SetStateAction<window.kakao.maps.Polygon[]>>
  primaryPolygon: window.kakao.maps.Polygon | null
  setPrimaryPolygon: React.Dispatch<React.SetStateAction<window.kakao.maps.Polygon | null>>
  primaryMarker: any
  setPrimaryMarker: React.Dispatch<React.SetStateAction<any>>
}

export const usePolygonManager = ({
  markerRef,
  polygonList,
  setPolygonList,
  primaryPolygon,
  setPrimaryPolygon,
  primaryMarker,
  setPrimaryMarker,
}: PolygonManagerProps) => {
  const handleDrawDistrictPolygon = useCallback(
    async (districtName: string, isPrimary = false) => {
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
          // 대표 동네 설정 시: 모든 폴리곤 제거
          if (primaryPolygon) primaryPolygon.setMap(null)
          if (primaryMarker) primaryMarker.setMap(null)
          polygonList.forEach((p) => p.setMap(null))
          setPolygonList([])
        } else {
          // 일반 동네 선택 시: 일반 폴리곤만 제거, 대표 동네는 유지
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
          fillOpacity: 0.15,
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
    },
    [markerRef, polygonList, setPolygonList, primaryPolygon, setPrimaryPolygon, primaryMarker, setPrimaryMarker],
  )

  return { handleDrawDistrictPolygon }
}
