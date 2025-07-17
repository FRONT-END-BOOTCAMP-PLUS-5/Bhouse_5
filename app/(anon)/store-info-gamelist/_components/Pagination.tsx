'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentPage: number
  totalCount: number
}

const ITEMS_PER_PAGE = 5

export default function Pagination({ currentPage, totalCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storeId = searchParams.get('storeId')

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (storeId) {
      router.push(`/store-info-gamelist?storeId=${storeId}&page=${page}`)
    }
  }

  return (
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        이전
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        다음
      </button>
    </div>
  )
}
