import { useQuery } from '@tanstack/react-query'
import { getBoardgamesService } from 'models/services/boardgame.service'

// useQuery => GET
// useMutation => POST, PATCH, PUT, DELETE
export const useGetBoardgameList = () => {
  return useQuery({
    queryKey: ['boardgameList'],
    queryFn: () => getBoardgamesService(),
  })
}
