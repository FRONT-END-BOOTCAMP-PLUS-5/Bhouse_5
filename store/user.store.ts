import { create } from 'zustand'

interface User {
  userId: string | null
}

interface UserProps extends User {
  setUserId: (userId: string) => void
}

const INIT = {
  userId: null,
}

export const useUserStore = create<UserProps>((set) => ({
  ...INIT,
  setUserId: (userId: string) => set(() => ({ userId })),
}))
