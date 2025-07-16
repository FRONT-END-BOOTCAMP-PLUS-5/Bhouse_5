export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`, {
    headers: {
      Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
    },
  })
  const json = await res.json()
  return json.documents?.[0]?.region_3depth_name ?? '알 수 없음'
}
