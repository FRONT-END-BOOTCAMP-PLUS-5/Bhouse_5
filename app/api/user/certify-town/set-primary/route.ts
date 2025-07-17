import { verifyToken } from '@bUtils/auth'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@bUtils/supabaseClient'

export async function POST(req: NextRequest) {
  const token = verifyToken(req)
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = token.userId
  const supabase = supabaseClient

  try {
    const body = await req.json()
    const { town } = body

    if (!town) {
      return NextResponse.json({ message: 'town is required' }, { status: 400 })
    }

    // ✅ Step 1: 이 유저의 모든 동네 is_primary = false 처리
    const { error: resetError } = await supabase.from('user_towns').update({ is_primary: false }).eq('user_id', userId)

    if (resetError) throw resetError

    // ✅ Step 2: 이 유저의 선택한 town만 is_primary = true 처리
    const { error: updateError } = await supabase
      .from('user_towns')
      .update({ is_primary: true })
      .eq('user_id', userId)
      .eq('town_name', town)

    if (updateError) throw updateError

    console.log(`[API] Set primary town for user ${userId}: ${town}`)

    return NextResponse.json({ message: 'Primary town set' }, { status: 200 })
  } catch (err) {
    console.error('set-primary API error:', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
