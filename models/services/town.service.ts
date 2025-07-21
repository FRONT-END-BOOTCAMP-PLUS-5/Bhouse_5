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

    const towns = await res.json()
    // Map townName to name for frontend compatibility
    return towns.map((town: any) => ({
      name: town.townName,
      isPrimary: town.isPrimary,
    }))
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

const SIDO_NAME_MAP: Record<string, string> = {
  서울: '서울특별시',
  부산: '부산광역시',
  대구: '대구광역시',
  인천: '인천광역시',
  광주: '광주광역시',
  대전: '대전광역시',
  울산: '울산광역시',
  세종: '세종특별자치시',
  경기: '경기도',
  강원: '강원특별자치도', // 구 강원도
  충북: '충청북도',
  충남: '충청남도',
  전북: '전라북도',
  전남: '전라남도',
  경북: '경상북도',
  경남: '경상남도',
  제주: '제주특별자치도',
}

export const extractDistrictName = (fullName: string): string => {
  const parts = fullName.split(' ')
  if (parts.length < 2) return fullName

  const sidoShort = parts[0] // 예: 서울
  const sigungu = parts[1] // 예: 종로구

  const fullSido = SIDO_NAME_MAP[sidoShort] || sidoShort
  return `${fullSido} ${sigungu}`
}

export const normalizeSidoName = (sido: string): string => {
  return SIDO_NAME_MAP[sido] || sido
}

export const getFullSidoFromAddress = (address: string): string | null => {
  // 예: '서울특별시 강남구 역삼동 123-4' → '서울특별시'
  const match = address.match(/^([^\s]+(?:특별시|광역시|자치시|도))/)
  return match ? match[1] : null
}
