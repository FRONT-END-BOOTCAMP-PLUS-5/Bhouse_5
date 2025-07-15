import { supabaseClient } from './supabaseClient'

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()

  if (error || !user) throw new Error('인증된 사용자 정보가 없습니다.')
  return user.id
}

export async function getCurrentUserRole(): Promise<'ADMIN' | 'OWNER' | 'USER'> {
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

  return profile.role === 'ADMIN' ? 'ADMIN' : profile.role === 'OWNER' ? 'OWNER' : 'USER'
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()
  if (error) throw error
  return user
}

export async function requireAdminUserId(): Promise<string> {
  const user = await getCurrentUser()
  if (!user) throw new Error('인증된 사용자 정보가 없습니다.')

  const { data: userData, error } = await supabaseClient.from('users').select('role').eq('id', user.id).single()

  if (error || !userData) throw new Error('사용자 권한 정보를 가져올 수 없습니다.')
  if (userData.role !== 'ADMIN') throw new Error('권한이 없습니다. 관리자만 접근 가능합니다.')

  return user.id
}
