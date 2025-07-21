import { BoardGameResponseDto } from '@be/application/boardgames/dtos/BoardGameResponseDto'
import instance from '@utils/instance'

// global type으로 빼기
interface ApiResponse<T> {
  success: boolean
  data: T
}

const PATH = '/api/boardgames'

export const getBoardgamesService = async () => {
  console.log('getBoardgamesService 안에서 찍힘')
  const res = await instance.get<ApiResponse<BoardGameResponseDto>>(PATH)
  console.log('응답 확인:', res.data)

  // 안정성 확보: data가 없으면 빈 배열 반환
  return res.data ?? []
}

export async function getBoardgamesByStoreId(storeId: number) {
  const response = await fetch(`/api/stores/${storeId}/boardgames`)
  if (!response.ok) {
    throw new Error('보드게임 데이터를 불러오는 데 실패했어요')
  }
  return await response.json()
}

export const getBoardgameDetailService = async (id: number) => {
  console.log('boardgame.service에서 호출한 getBoardgameDetailService')
  const res = await instance.get(`/api/boardgames/${id}`)
  console.log('getBoardgameDetailService res:', res)
  return res.data // 이 형태는 API에 따라 조정 필요
}

export const getStoresByBoardgameId = async (boardgameId: number) => {
  const res = await instance.get(`/api/boardgames/stores?boardgame_id=${boardgameId}`)
  return res.data
}
