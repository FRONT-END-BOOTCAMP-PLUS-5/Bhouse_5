import { NextRequest, NextResponse } from 'next/server'
import { CreatePostUseCase } from '@be/application/community/posts/usecases/CreatePostUseCase'
import { DeletePostUseCase } from '@be/application/community/posts/usecases/DeletePostUseCase'
import { PostRepositoryImpl } from '@infrastructure/repositories/PostRepositoryImpl'
import { supabaseClient } from '@bUtils/supabaseClient';
import { GetPostListUseCase } from './usecases/GetPostListUseCase';

//TODO: patch, delete 만들기


//게시글 작성 API
export async function POST(req: NextRequest) {
  const { title, content, town } = await req.json()
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')

  const {
    data: { user },
    error
  } = await supabaseClient.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json({ message: '인증 실패' }, { status: 401 })
  }

  const repo = new PostRepositoryImpl()
  const useCase = new CreatePostUseCase(repo)

  try {
    const post = await useCase.execute(user.id, title, content, town)
    return NextResponse.json({ message: '글 등록 완료', data: post })
  } catch (e) {
    return NextResponse.json({ message: '글 등록 실패', error: (e as Error).message }, { status: 500 })
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

export async function GET(req: NextRequest) {
  const useCase = new GetPostListUseCase()

  try {
    const result = await useCase.execute()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ message: '글 조회 실패', error: err }, { status: 500 })
  }
}

// 게시글 삭제 API

// DELETE /api/community/posts → 글 삭제
export async function DELETE(req: NextRequest) {
  const { post_id } = await req.json()
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')

  const {
    data: { user },
    error
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
export async function PATCH(req: NextRequest) {
  const { post_id, title, content } = await req.json()
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ message: '토큰이 필요합니다.' }, { status: 401 })
  }

  if (!post_id || !title || !content) {
    return NextResponse.json({ message: 'post_id, title, content는 필수입니다.' }, { status: 400 })
  }

  // 🔐 사용자 인증
  const {
    data: { user },
    error: userError
  } = await supabaseClient.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ message: '유저 인증 실패', error: userError }, { status: 401 })
  }

  // 📝 글 업데이트
  const { data, error: updateError } = await supabaseClient
    .from('community_posts')
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
      updated_by: user.id
    })
    .eq('post_id', post_id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ message: '글 수정 실패', error: updateError }, { status: 500 })
  }

  return NextResponse.json({ message: '수정 완료', updated_post: data })
}
