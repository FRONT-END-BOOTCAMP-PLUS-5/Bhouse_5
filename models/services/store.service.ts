import instance from '@utils/instance'

// 글로벌 타입
interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface StoreResponse {
  storeId: number
  name: string
  address: string
  phone: string
  description: string
  imagePlaceUrl: string
  imageMenuUrl: string
  openTime: string
  ownerName: string
}

export const getStoreByIdService = async (storeId: number): Promise<StoreResponse> => {
  const res = await instance.get(`/api/stores/${storeId}`)
  console.log('응답:', res.data)
  return res.data as StoreResponse
}
