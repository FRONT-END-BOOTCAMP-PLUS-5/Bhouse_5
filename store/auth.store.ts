import { UserProfileResponseDto } from '@be/application/user/profile/dtos/UserProfileDto'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Auth extends UserProfileResponseDto {
  isLogin: boolean
}

interface AuthProps extends Auth {
  setLogin: (data: UserProfileResponseDto) => void
  setLogout: () => void
}

const INIT = {
  isLogin: false,

  nickname: '',
  profile: '',
  user_id: '',
  username: '',
  email: '',
  phone: '',
  profile_img_url: '',
  provider: '',
  provider_id: '',
  created_at: '',
  updated_at: '',
}

export const useAuthStore = create(
  persist<AuthProps>(
    (set) => ({
      ...INIT,
      setLogin: (data: UserProfileResponseDto) => {
        return set(() => ({ isLogin: true, ...data }))
      },
      setLogout: () => set(() => ({ ...INIT })),
    }),
    { name: 'auth' },
  ),
)
