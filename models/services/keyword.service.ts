// src/models/services/keyword.service.ts
import instance from '@utils/instance'

// API 응답의 최상위 구조를 나타내는 인터페이스
interface ApiResponse<T> {
  success: boolean
  // 이전에는 data 필드가 있었지만, 이제 'keywords'가 직접 여기에 올 수 있습니다.
}

// 개별 키워드의 구조
interface Keyword {
  keywordId: number // "keywordId"로 변경됨
  keyword: string
  createdAt: string
}

// GET 요청 응답 전체를 위한 인터페이스 정의 (keywords 배열이 직접 포함됨)
// ⭐ 이 부분이 가장 중요하게 수정되어야 합니다.
interface GetKeywordsApiResponse {
  success: boolean
  keywords: Keyword[] // 'data' 필드 없이 'keywords'가 바로 존재
}

interface PostKeywordBody {
  keyword: string
}

interface DeleteKeywordBody {
  keyword_id: number
}

const PATH = '/api/user/keywords'

export const getKeywordsService = async (): Promise<Keyword[]> => {
  // ⭐ API 응답 타입 파라미터를 GetKeywordsApiResponse로 변경
  const res = await instance.get<GetKeywordsApiResponse>(PATH)
  // ⭐ 응답 데이터 구조에 맞춰 res.data.keywords에 직접 접근하도록 수정
  console.log('getKeywordsService 응답 전체:', res.data) // 디버깅을 위해 추가
  return res.data?.keywords ?? []
}

export const postKeywordService = async (body: PostKeywordBody): Promise<Keyword> => {
  // Post 요청의 응답 구조가 Keyword를 직접 반환하는 경우에 해당
  const res = await instance.post<ApiResponse<Keyword>>(PATH, body) // Post 응답은 data 필드를 가질 수 있다고 가정
  console.log('postKeywordService 응답 전체:', res.data) // 디버깅을 위해 추가
  return res.data.data // Post 응답은 data 필드 안에 실제 데이터가 있다고 가정
}

export const deleteKeywordService = async (body: DeleteKeywordBody) => {
  const res = await instance.delete<ApiResponse<null>>(PATH, { data: body })
  console.log('deleteKeywordService 응답 전체:', res.data) // 디버깅을 위해 추가
  return res.data.success
}
