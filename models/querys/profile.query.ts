import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfileService, updateProfileService } from 'models/services/profile.service'
import { useAuthStore } from 'store/auth.store'

// useQuery => GET
// useMutation => POST, PATCH, PUT, DELETE

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getProfileService(),
  })
}

export const useGetUserProfileDetail = (id: string) => {
  return useQuery({
    queryKey: ['userProfileDetail', id],
    queryFn: () => getProfileService(),
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  const setLogin = useAuthStore((state) => state.setLogin)

  return useMutation({
    mutationFn: (data: { nickname: string; profileImgUrl: string; password?: string }) => updateProfileService(data),
    onSuccess: (updatedUser) => {
      // 쿼리 캐시 무효화 - 더 강력하게
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      queryClient.invalidateQueries({ queryKey: ['userProfileDetail'] })

      // 주스탠드 스토어 업데이트
      if (updatedUser) {
        setLogin(updatedUser)
      }

      // 캐시를 즉시 업데이트
      queryClient.setQueryData(['userProfile'], updatedUser)
    },
  })
}
