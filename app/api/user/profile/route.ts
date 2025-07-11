import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@be/utils/auth'
import { supabaseClient } from '@be/utils/supabaseClient'

interface UserProfile {
  user_id: string
  username: string
  email: string
  nickname: string
  phone: string
  profile_img_url: string
  provider: string
  provider_id: string
  created_at: string
  updated_at: string
}

export async function GET(request: NextRequest) {
  try {
    // 토큰 검증 - utils/auth.ts 함수 사용
    const decoded = await verifyToken(request)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Supabase에서 유저 정보 조회
    const { data: user, error } = await supabaseClient.from('users').select('*').eq('user_id', decoded.userId).single()

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404 },
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404 },
      )
    }

    const userProfile: UserProfile = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      phone: user.phone,
      profile_img_url: user.profile_img_url,
      provider: user.provider,
      provider_id: user.provider_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    return NextResponse.json({
      success: true,
      data: userProfile,
    })
  } catch (error: any) {
    console.error('Profile API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    )
  }
}
