import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@bUtils/supabaseClient'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ message: '로그인 토큰이 필요합니다.' }, { status: 401 })
  }

  // 1. 토큰으로 유저 정보 조회
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ message: '유저 인증 실패', error: userError }, { status: 401 })
  }

  // 2. 유저의 찜한 boardgame_id 목록 가져오기
  const { data: likes, error: likeError } = await supabase
    .from('user_likes') // 또는 'wishlist' 등 찜 테이블 이름
    .select('boardgame_id')
    .eq('user_id', user.id)

  if (likeError) {
    return NextResponse.json({ message: '찜 목록 조회 실패', error: likeError }, { status: 500 })
  }

  const boardgameIds = likes.map((like) => like.boardgame_id)

  if (boardgameIds.length === 0) {
    return NextResponse.json({ data: [] })
  }

  // 3. boardgames 테이블에서 상세 정보 조회
  const { data: boardgames, error: gameError } = await supabase
    .from('boardgames')
    .select('id, name, image_url, difficulty, min_players, max_players')
    .in('id', boardgameIds)

  if (gameError) {
    return NextResponse.json({ message: '보드게임 정보 조회 실패', error: gameError }, { status: 500 })
  }

  return NextResponse.json({ data: boardgames })
}
