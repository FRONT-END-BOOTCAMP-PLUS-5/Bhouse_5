import { NextRequest, NextResponse } from 'next/server'
import { PostRepositoryImpl } from '@infrastructure/repositories/PostRepositoryImpl'

import { CreatePostUseCase } from '@be/application/community/posts/usecases/CreatePostUseCase'
import { DeletePostUseCase } from '@be/application/community/posts/usecases/DeletePostUseCase'
import { GetPostListUseCase } from '@application/community/posts/usecases/GetPostListUseCase'

import { supabaseClient } from '@bUtils/supabaseClient'

//게시글 작성 API
export async function POST(req: NextRequest) {
  const usecase = new CreatePostUseCase(new PostRepositoryImpl())
  try {
    const body = await req.json()
    console.log('[CreatePostRoute] Request body:', body)
    const { userId, title, content, town } = body
    if (!userId || !title || !content) {
      return NextResponse.json({ message: '필수 항목이 누락되었습니다.' }, { status: 400 })
    }

    const result = await usecase.execute({ userId, title, content, categoryId: body.categoryId, town })
    return NextResponse.json(result)
  } catch (error) {
    console.error('[CreatePostRoute Error]', error)
    return NextResponse.json({ message: '게시글 생성 실패', error }, { status: 500 })
  }
}

//// 게시글 목록 조회 API
// API 설명
// {
//   // /community/posts API
//   // 이 API는 커뮤니티 게시글 목록을 조회합니다.
//   // 요청 예시:
//   // GET /api/community/posts
//   // 응답 예시:
//   // {
//   //   "data": [
//   //     {
//   //       "post_id": 1,
//   //       "title": "첫 번째 게시글",
//   //       "content": "안녕하세요, 첫 번째 게시글입니다!",
//   //       "created_at": "2023-10-01T12:00:00Z",
//   //       "address": "서울시 강남구",
//   //       "hits": 10,
//   //       "user": {
//   //         "nickname": "홍길동",
//   //         "profile_img_url": "https://example.com/profile.jpg"
//   //       }
//   //     },

// app/api/community/posts/route.ts

export async function GET() {
  const usecase = new GetPostListUseCase(new PostRepositoryImpl())

  try {
    const posts = await usecase.execute()
    return NextResponse.json(posts)
  } catch (err) {
    console.error('[GetPostListRoute Error]', err)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}

// 게시글 삭제 API

// DELETE /api/community/posts → 글 삭제
export async function DELETE(req: NextRequest) {
  const { post_id } = await req.json()
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json({ message: '인증 실패' }, { status: 401 })
  }

  const repo = new PostRepositoryImpl()
  const useCase = new DeletePostUseCase(repo)

  try {
    await useCase.execute(post_id, user.id)
    return NextResponse.json({ message: '글 삭제 완료' })
  } catch (e) {
    return NextResponse.json({ message: '글 삭제 실패', error: (e as Error).message }, { status: 500 })
  }
}

// 게시글 수정 API
// {
//   "post_id": 123,
//   "title": "수정된 제목",
//   "content": "수정된 내용입니다."
// }
// post_id,title,content를 가져와서, 글을 수정합니다.
