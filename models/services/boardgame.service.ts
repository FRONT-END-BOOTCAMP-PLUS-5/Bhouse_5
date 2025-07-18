import { BoardGameResponseDto } from '@be/application/boardgames/dtos/BoardGameResponseDto'
import instance from '@utils/instance'

// global type으로 빼기
interface ApiResponse<T> {
  success: boolean
  data: T
}

const PATH = '/api/boardgames'

export const getBoardgamesService = async () => {
  const res = await instance.get<ApiResponse<BoardGameResponseDto>>(PATH)
  console.log('응답 확인:', res.data)

  // 안정성 확보: data가 없으면 빈 배열 반환
  return res.data?.data ?? []
}
