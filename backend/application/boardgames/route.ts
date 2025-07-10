// app/api/boardgames/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@bUtils/supabaseClient'


// /boardgames API
// 이 API는 보드게임 목록을 조회합니다.
// 요청 예시:
// GET /api/boardgames?name=카탄&genre=전략&minPlayers=2&maxPlayers=4
// 응답 예시:
// [
//   {
//     "id": 1,
//     "name": "카탄",
//     "genres": ["전략", "협력"],
//     "min_players": 2,
//     "max_players": 4,
//     "description": "카탄의 개척자들"
//   }]
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const genre = searchParams.get('genre')
  const minPlayers = searchParams.get('minPlayers')
  const maxPlayers = searchParams.get('maxPlayers')

  let query = supabase.from('boardgames').select('*')

  if (name) {
    query = query.ilike('name', `%${name}%`)
  }

  if (genre) {
    query = query.contains('genres', [genre])  // genres가 array 컬럼일 경우
  }

  if (minPlayers) {
    query = query.gte('min_players', Number(minPlayers))
  }

  if (maxPlayers) {
    query = query.lte('max_players', Number(maxPlayers))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ message: '조회 실패', error }, { status: 500 })
  }

  return NextResponse.json(data)
}
