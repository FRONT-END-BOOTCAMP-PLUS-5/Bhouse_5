import { useQuery } from '@tanstack/react-query'
import { getBoardgamesByStoreId, getBoardgamesService } from 'models/services/boardgame.service'

// useQuery => GET
// useMutation => POST, PATCH, PUT, DELETE
export const useGetBoardgameList = (inputValue: string) => {
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
