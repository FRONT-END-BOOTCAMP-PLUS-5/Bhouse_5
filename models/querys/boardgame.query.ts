import { useQuery } from '@tanstack/react-query'
import { getBoardgamesService } from 'models/services/boardgame.service'

// useQuery => GET
// useMutation => POST, PATCH, PUT, DELETE
export const useGetBoardgameList = (inputValue: string) => {
  return useQuery({
    queryKey: ['boardgameList'],
    queryFn: () => getBoardgamesService(),
  })
}
