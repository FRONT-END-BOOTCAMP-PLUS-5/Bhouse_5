// @store/userActivity.store.ts
import { create } from 'zustand'

interface UserActivityState {
  postsCount: number | null
  commentsCount: number | null
  setActivityCounts: (posts: number, comments: number) => void
}

export const useUserActivityStore = create<UserActivityState>((set) => ({
  postsCount: null,
  commentsCount: null,
  setActivityCounts: (posts, comments) => set({ postsCount: posts, commentsCount: comments }),
}))
