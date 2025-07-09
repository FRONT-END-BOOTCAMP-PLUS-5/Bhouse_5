import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@bUtils/supabaseClient'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const boardgameId = searchParams.get('boardgame_id')

  if (!boardgameId) {
    return NextResponse.json(
      { message: 'boardgame_id는 필수입니다.' },
      { status: 400 }
    )
  }

  // 1. 보드게임을 소유한 store_id 목록 조회
  const { data: ownerships, error: linkError } = await supabase
    .from('store_own_boardgames')
    .select('store_id')
    .eq('boardgame_id', boardgameId)

  if (linkError || !ownerships) {
    return NextResponse.json(
      { message: '보드게임 보유 매장 조회 실패', error: linkError },
      { status: 500 }
    )
  }

  const storeIds = ownerships.map((entry) => entry.store_id)

  if (storeIds.length === 0) {
    return NextResponse.json([])  // 해당 보드게임을 가진 매장이 없음
  }

  // 2. store_places 테이블에서 매장 정보 조회
  const { data: stores, error: storeError } = await supabase
    .from('store_places')
    .select('store_id, name, address')
    .in('store_id', storeIds)

  if (storeError) {
    return NextResponse.json(
      { message: '매장 정보 조회 실패', error: storeError },
      { status: 500 }
    )
  }

  return NextResponse.json(stores)
}
