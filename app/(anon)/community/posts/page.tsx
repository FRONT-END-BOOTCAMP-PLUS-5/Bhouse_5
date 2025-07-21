'use client'

import { useEffect, useState } from 'react'
import PostList from '@/_components/Post/PostList'
import { usePostsQuery } from 'models/querys/community.query'
import CategoryTabs from '@/_components/Post/CategoryTabs'
import instance from '@utils/instance'
import { UserProfileResponseDto } from '@be/application/user/profile/dtos/UserProfileDto'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export default function CommunityPostsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedTab, setSelectedTab] = useState<{ id: string; label: string } | null>(null)
  const [userTown, setUserTown] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get<ApiResponse<UserProfileResponseDto>>('/api/user/profile')
        const profileData = res.data.data
        console.log(profileData)
        setIsLoggedIn(true)

        // Extract primary town name from the towns array
        const primaryTown = profileData.towns.find((town) => town.is_primary)
        console.log('🏡 primaryTown:', primaryTown)
        setUserTown(primaryTown?.town_name ?? null)
      } catch (e) {
        console.error('[Profile Fetch Error]', e)
        setIsLoggedIn(false)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (userTown !== null) {
      console.log('✅ userTown updated to:', userTown)
    }
  }, [userTown])

  const { data: posts = [] } = usePostsQuery(
    selectedCategoryId,
    isLoggedIn ? userTown : null,
    isLoggedIn,
    selectedTab ?? { id: 'all', label: '전체' },
  )

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const indexOfLast = currentPage * postsPerPage
  const indexOfFirst = indexOfLast - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirst, indexOfLast)

  const transformedPosts = currentPosts.map((post) => ({
    ...post,
    hits: post.hits ?? 0,
  }))

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  return (
    <div>
      <h1>커뮤니티</h1>
      <CategoryTabs
        selectedId={selectedCategoryId}
        onChange={(categoryId) => {
          setSelectedCategoryId(categoryId)
          if (categoryId === null) {
            setSelectedTab({ id: 'all', label: '전체' })
          } else {
            // Find the corresponding tab label based on categoryId
            const tabLabels = { 1: '모집', 2: '정보', 3: '질문', 4: '자유' }
            setSelectedTab({
              id: categoryId.toString(),
              label: tabLabels[categoryId as keyof typeof tabLabels] || '전체',
            })
          }
        }}
        isLoggedIn={isLoggedIn}
      />
      <PostList
        posts={transformedPosts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        tabId={Number(selectedTab?.id)}
      />
    </div>
  )
}
