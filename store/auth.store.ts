import { UserProfileResponseDto } from '@be/application/user/profile/dtos/UserProfileDto'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Auth {
  isLogin: boolean
  user: UserProfileResponseDto
}

interface AuthProps extends Auth {
  setLogin: (data: UserProfileResponseDto) => void
  setLogout: () => void
}

const INIT = {
  isLogin: false,
  user: {
    user_id: '',
    username: '',
    email: '',
    nickname: '',
    phone: '',
    profile_img_url: '',
    provider: '',
    provider_id: '',
    created_at: '',
    updated_at: '',
    user_role: {
      role_id: 0,
      name: '오잉오잉',
    },
  },
}

export const useAuthStore = create(
  persist<AuthProps>(
    (set) => ({
      ...INIT,
      setLogin: (data: UserProfileResponseDto) => {
        return set(() => ({ isLogin: true, user: data }))
      },
      setLogout: () => set(() => ({ ...INIT })),
    }),
    { name: 'auth' },
  ),
)
