// src/models/queries/keyword.query.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getKeywordsService, postKeywordService, deleteKeywordService } from 'models/services/keyword.service'

// 키워드 목록 조회 (GET)
export const useGetKeywordList = () => {
  return useQuery({
    queryKey: ['keywordList'],
    queryFn: getKeywordsService,
  })
}

// 키워드 추가 (POST)
export const usePostKeyword = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postKeywordService,
    onSuccess: () => {
      // 키워드 추가 성공 시 'keywordList' 쿼리를 무효화하여 자동으로 최신 목록을 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ['keywordList'] })
    },
    onError: (error) => {
      console.error('키워드 추가 실패:', error)
      // 에러 처리 로직 (예: 사용자에게 알림)
    },
  })
}

// 키워드 삭제 (DELETE)
export const useDeleteKeyword = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteKeywordService,
    onSuccess: () => {
      // 키워드 삭제 성공 시 'keywordList' 쿼리를 무효화하여 자동으로 최신 목록을 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ['keywordList'] })
    },
    onError: (error) => {
      console.error('키워드 삭제 실패:', error)
      // 에러 처리 로직 (예: 사용자에게 알림)
    },
  })
}
