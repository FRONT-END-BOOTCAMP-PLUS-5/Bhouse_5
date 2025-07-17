import instance from '@utils/instance'

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`, {
    headers: {
      Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
    },
  })
  const json = await res.json()
  return json.documents?.[0]?.region_3depth_name ?? '알 수 없음'
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`))

  return match?.split('=')[1]
}

export const fetchTowns = async (): Promise<{ name: string; isPrimary: boolean }[]> => {
  const token = getCookie('accessToken')

  try {
    const res = await fetch('/api/user/certify-town', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      // 404, 500 등 오류 시
      console.warn('동네 목록 조회 실패:', res.status)
      return []
    }

    return await res.json()
  } catch (e) {
    console.error('동네 목록 요청 중 에러 발생:', e)
    return []
  }
}

export const addTown = async (dto: { townName: string; lat: number; lng: number }): Promise<void> => {
  try {
    await instance.post('/api/user/certify-town', {
      townName: dto.townName,
      latitude: dto.lat,
      longitude: dto.lng,
    })
  } catch (error: any) {
    console.error('동네 등록 실패:', error?.response?.data || error.message)
    throw new Error('동네 등록 실패')
  }
}

export const removeTown = async (townName: string): Promise<void> => {
  const res = await fetch(`/api/user/certify-town`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ townName: townName }),
  })

  if (!res.ok) throw new Error('동네 삭제 실패')
}

export const setPrimaryTown = async (townName: string): Promise<void> => {
  const res = await fetch('/api/user/certify-town/set-primary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ town: townName }),
  })

  if (!res.ok) throw new Error('대표 동네 설정 실패')
}
