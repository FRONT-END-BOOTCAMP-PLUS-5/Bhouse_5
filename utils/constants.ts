export const API = '/api/'
export const extractDistrictName = (fullAddress: string) => {
  // 예: '대한민국 서울특별시 강남구 역삼동' → ['대한민국', '서울특별시', '강남구', '역삼동']
  const parts = fullAddress.split(' ')

  // '시군구'는 일반적으로 parts[1]과 parts[2]에 위치
  if (parts.length >= 3) {
    // 예외처리: 제주도는 시 없이 '제주시', '서귀포시'로 끝남
    if (parts[1].endsWith('도') && parts[2].endsWith('시')) {
      return parts[2] // e.g. '제주시'
    }
    return `${parts[1]} ${parts[2]}` // e.g. '서울특별시 강남구'
  }

  return fullAddress // fallback
}
