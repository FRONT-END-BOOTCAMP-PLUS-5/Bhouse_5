import { useQuery } from '@tanstack/react-query'
import { getProfileService } from 'models/services/profile.service'

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
