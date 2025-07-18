import { useQuery } from '@tanstack/react-query'
import { getStoreByIdService } from '../services/store.service'

export const useGetStoreById = (storeId: number) => {
  console.log('🔍 useQuery 호출됨 with ID:', storeId)

  return useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const result = await getStoreByIdService(storeId)
      console.log('🔍 queryFn 결과:', result)
      return result
    },
  })
}
