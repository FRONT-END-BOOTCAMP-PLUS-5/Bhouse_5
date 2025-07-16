import React, { useState } from 'react'
import { getCurrentLocation } from '@/_hooks/useLocation'
import { reverseGeocode } from '@/_lib/town'

export default function TownRegisterForm() {
  const [towns, setTowns] = useState<string[]>([])
  const [currentTown, setCurrentTown] = useState<string | null>(null)

  const handleDetectLocation = async () => {
    const { latitude, longitude } = await getCurrentLocation()
    const townName = await reverseGeocode(latitude, longitude)
    setCurrentTown(townName)
  }

  const handleRegister = () => {
    if (currentTown && !towns.includes(currentTown)) {
      if (towns.length >= 3) {
        alert('동네는 최대 3개까지 등록 가능합니다.')
        return
      }
      setTowns([...towns, currentTown])
    }
  }

  return (
    <div>
      <button onClick={handleDetectLocation}>현재 위치로 찾기</button>
      {currentTown && (
        <div>
          <p>선택한 동네: {currentTown}</p>
          <button onClick={handleRegister}>등록하기</button>
        </div>
      )}

      <ul>
        {towns.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
