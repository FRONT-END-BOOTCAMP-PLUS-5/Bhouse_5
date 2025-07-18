export const getCurrentLocation = (): Promise<{
  latitude: number
  longitude: number
}> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 정보를 지원하지 않는 브라우저입니다.'))
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (err) => reject(err),
    )
  })
