import axios from 'axios'

// https://axios-http.com/docs/instance
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// https://axios-http.com/docs/interceptors
instance.interceptors.request.use(
  function (config) {
    // 요청이 전송되기 전에 무언가를 수행합니다
    return config
  },
  function (error) {
    // 요청 오류가 발생했을 때 무언가를 수행합니다
    return Promise.reject(error)
  },
)

// 응답 인터셉터 추가
instance.interceptors.response.use(
  function (response: any) {
    // 2xx(ex: 200, 201, 204) 범위 내에 있는 모든 상태 코드는 이 함수를 트리거하게 합니다
    // 응답 데이터로 작업하기

    // if (response.data) return response.data

    return response
  },
  function (error) {
    // 2xx(ex: 404, 500) 범위를 벗어난 모든 상태 코드는 이 함수를 트리거하게 합니다
    // 응답 오류로 작업하기
    return Promise.reject(error)
  },
)

export default instance
