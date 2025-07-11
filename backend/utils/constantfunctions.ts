import { supabaseClient } from './supabaseClient'

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()

  if (error || !user) throw new Error('인증된 사용자 정보가 없습니다.')
  return user.id
}

export async function getCurrentUserRole(): Promise<'admin' | 'user'> {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()

  if (error || !user) throw new Error('인증된 사용자 정보가 없습니다.')

  const { data: profile, error: profileError } = await supabaseClient
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile?.role) {
    throw new Error('사용자 권한 정보를 불러올 수 없습니다.')
  }

  return profile.role === 'admin' ? 'admin' : 'user'
}
