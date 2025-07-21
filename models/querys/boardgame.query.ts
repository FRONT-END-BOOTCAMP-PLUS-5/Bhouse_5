import { useQuery } from '@tanstack/react-query'
import {
  getBoardgameDetailService,
  getBoardgamesByStoreId,
  getBoardgamesService,
  getStoresByBoardgameId,
} from 'models/services/boardgame.service'

// useQuery => GET
// useMutation => POST, PATCH, PUT, DELETE
export const useGetBoardgameList = (inputValue?: string) => {
  console.log('query에서 보내는 useGetBoardgameList 실행됐습니다~')
  return useQuery({
    queryKey: ['boardgameList'],
    queryFn: () => getBoardgamesService(),
  })
}

export const useStoreBoardgames = async (storeId: number) => {
  try {
    const res = await getBoardgamesByStoreId(storeId)
    return res.data // [{ id, title, imgUrl }, ...]
  } catch (err) {
    console.error('보드게임 불러오기 실패', err)
    return []
  }
}

export const useGetBoardgameDetail = (id: number) => {
  console.log('useGetBoardgameDetail boardgame.query에서 호출:id :', id)
  return useQuery({
    queryKey: ['boardgameDetail', id],
    queryFn: () => getBoardgameDetailService(id),
    enabled: !!id, // id가 있어야 요청 실행됨
  })
}

export const useGetStoresByBoardgameId = (boardgameId: number) => {
  console.log('useGetStore boardgameId', boardgameId)
  return useQuery({
    queryKey: ['stores-by-boardgame', boardgameId],
    queryFn: () => getStoresByBoardgameId(boardgameId),
    enabled: !!boardgameId, // boardgameId 있을 때만 호출
  })
}
