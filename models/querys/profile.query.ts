import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfileService, updateProfileService } from 'models/services/profile.service'

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
  return useMutation({
    mutationFn: (data: { nickname: string; profileImgUrl: string }) => updateProfileService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
  })
}
