export const API = '/api/'
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
