// PATCH /api/community/posts/[post_id]/hits
import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@bUtils/supabaseClient'

export async function PATCH(_: NextRequest, context: { params: { post_id: string } }) {
  const postId = Number(context.params.post_id)

  const { error } = await supabaseClient.rpc('increment_post_hits', { input_post_id: postId })

  if (error) {
    return NextResponse.json({ message: '조회수 증가 실패', error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
