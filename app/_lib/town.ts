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
  const token = document.cookie
    .split('; ')
    .find((c) => c.startsWith('accessToken='))
    ?.split('=')[1]

  const res = await fetch('/api/towns', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('동네 목록 조회 실패')

  return await res.json()
}

export const addTown = async (dto: { townName: string; lat: number; lng: number }): Promise<void> => {
  const token = getCookie('accessToken')
  if (!token) throw new Error('토큰 없음')

  const res = await fetch('/api/towns', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ town: dto.townName }),
  })

  if (!res.ok) throw new Error('동네 등록 실패')
}

export const removeTown = async (townName: string): Promise<void> => {
  const token = getCookie('accessToken')
  if (!token) throw new Error('토큰 없음')

  const res = await fetch(`/api/towns`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ town: townName }),
  })

  if (!res.ok) throw new Error('동네 삭제 실패')
}

export const setPrimaryTown = async (townName: string): Promise<void> => {
  const token = getCookie('accessToken')
  if (!token) throw new Error('토큰 없음')

  const res = await fetch('/api/towns/set-primary', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ town: townName }),
  })

  if (!res.ok) throw new Error('대표 동네 설정 실패')
}
