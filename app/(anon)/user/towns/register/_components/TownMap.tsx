'use client'

import { useEffect, useRef } from 'react'

interface TownMapProps {
  selectedTown: { name: string; lat: number; lng: number } | null
  onTownSelect: (town: { name: string; lat: number; lng: number }) => void
  onMapReady: () => void
}

export default function TownMap({ selectedTown, onTownSelect, onMapReady }: TownMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.kakao?.maps && mapRef.current) {
        clearInterval(interval)
        onMapReady()
      }
    }, 100)
    return () => clearInterval(interval)
  }, [onMapReady])

  useEffect(() => {
    if (!window.kakao?.maps || !mapRef.current) return

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
  }, [])

  const getAddressFromCoords = (latlng: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder()
    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name
        onTownSelect({
          name: address,
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        })
      }
    })
  }

  const handleAddressSearch = (townListLength: number) => {
    if (townListLength >= 3) {
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

            onTownSelect({
              name: regionAddress,
              lat: coords.getLat(),
              lng: coords.getLng(),
            })
          }
        })
      },
    }).open()
  }

  return {
    mapRef,
    markerRef,
    handleAddressSearch,
  }
}
