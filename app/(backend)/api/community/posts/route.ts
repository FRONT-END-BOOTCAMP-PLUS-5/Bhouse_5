import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@bUtils/supabaseClient';



export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, content, category_name, town } = body

  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ message: '토큰이 필요합니다.' }, { status: 401 })
  }

  if (!title || !content || !category_name || !town) {
    return NextResponse.json(
      { message: 'title, content, category_name, town은 필수입니다.' },
      { status: 400 }
    )
  }

  // 사용자 인증
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ message: '사용자 인증 실패', error: userError }, { status: 401 })
  }

  // category_name → category_id 조회
  const { data: categoryData, error: categoryError } = await supabase
    .from('community_categories')
    .select('id')
    .eq('name', category_name)
    .single()

  if (categoryError || !categoryData) {
    return NextResponse.json(
      { message: '유효하지 않은 category_name입니다.', error: categoryError },
      { status: 400 }
    )
  }

  // 게시글 저장
  const { data: insertedPost, error: insertError } = await supabase
    .from('community_posts')
    .insert([
      {
        user_id: "0307eb5e-6f8e-4165-a2ec-4f9e2fb5d196",
        title : "sample title",
        content : "sample content",
        category_id: "categoryData.id",
        town : "sample town",
        hits: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ message: '게시글 저장 실패', error: insertError }, { status: 500 })
  }

  return NextResponse.json(insertedPost)
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
export async function GET(_req: NextRequest) {
  // 1. 게시글 목록 조회 (user_id 포함)
  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select('post_id, user_id, title, content, created_at, town, hits')
    .order('created_at', { ascending: false })

  if (postsError) {
    return NextResponse.json({ message: '게시글 조회 실패', error: postsError }, { status: 500 })
  }

  // 2. user_id → 프로필 정보 가져오기
  const userIds = [...new Set(posts.map((post) => post.user_id))] // 중복 제거

  const { data: profiles, error: profilesError } = await supabase
    .from('users') // 또는 users 테이블
    .select('user_id, nickname, profile_img_url')
    .in('user_id', userIds)

  if (profilesError) {
    return NextResponse.json({ message: '유저 정보 조회 실패', error: profilesError }, { status: 500 })
  }

  const profileMap = new Map(profiles.map((p) => [p.user_id, p]))

  // 3. 응답 포맷 구성
  const formatted = posts.map((post) => {
    const user = profileMap.get(post.user_id)
    return {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      address: post.town,
      hits: post.hits,
      user: {
        nickname: user?.nickname ?? '익명',
        profile_img_url: user?.profile_img_url ?? null
      }
    }
  })

  return NextResponse.json({
    data: formatted,
    total: formatted.length
  })
}


// 게시글 삭제 API -> post_id를 통해 게시글을 삭제합니다.
export async function DELETE(req: NextRequest) {
  const { post_id } = await req.json()

  if (!post_id) {
    return NextResponse.json({ message: 'post_id는 필수입니다.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('post_id', post_id)

  if (error) {
    return NextResponse.json({ message: '게시글 삭제 실패', error }, { status: 500 })
  }

  return NextResponse.json({ message: '게시글이 삭제되었습니다.', post_id })
}
