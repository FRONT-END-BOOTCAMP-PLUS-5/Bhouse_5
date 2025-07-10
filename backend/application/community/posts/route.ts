import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@bUtils/supabaseClient';

//TODO: patch, delete 만들기


//게시글 작성 API
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
  } = await supabaseClient.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ message: '사용자 인증 실패', error: userError }, { status: 401 })
  }

  // category_name → category_id 조회
  const { data: categoryData, error: categoryError } = await supabaseClient
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
  const { data: insertedPost, error: insertError } = await supabaseClient
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
  const { data: posts, error: postsError } = await supabaseClient
    .from('community_posts')
    .select('post_id, user_id, title, content, created_at, town, hits')
    .order('created_at', { ascending: false })

  if (postsError) {
    return NextResponse.json({ message: '게시글 조회 실패', error: postsError }, { status: 500 })
  }

  // 2. user_id → 프로필 정보 가져오기
  const userIds = [...new Set(posts.map((post) => post.user_id))] // 중복 제거

  const { data: profiles, error: profilesError } = await supabaseClient
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


// 게시글 삭제 API
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('post_id')

  if (!postId) {
    return NextResponse.json({ message: 'post_id는 필수입니다.' }, { status: 400 })
  }

  // 게시글 삭제
  const { error: deleteError } = await supabaseClient
    .from('community_posts')
    .delete()
    .eq('post_id', postId)

  if (deleteError) {
    return NextResponse.json({ message: '게시글 삭제 실패', error: deleteError }, { status: 500 })
  }

  return NextResponse.json({ message: '게시글이 성공적으로 삭제되었습니다.' })
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

