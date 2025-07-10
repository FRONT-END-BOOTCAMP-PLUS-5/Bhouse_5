import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { User } from '@be/domain/entities/User'
import { createClient } from '@supabase/supabase-js'

export class AuthRepositoryImpl implements AuthRepository {
  private supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

  async signup(user: User, roles: number): Promise<void> {
    // 1. users 테이블에 insert
    const { data, error } = await this.supabase
      .from('users')
      .insert([
        {
          username: user.username,
          email: user.email,
          password: user.password,
          nickname: user.nickname,
          phone: user.phone,
          profile_img_url: user.profile_img_url,
          provider: user.provider,
          provider_id: user.provider_id,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      ])
      .select('user_id')

    if (error || !data || !data[0]?.user_id) {
      throw new Error(`회원가입 실패: ${error?.message}`)
    }

    const user_id = data[0].user_id

    // 2. user_roles 테이블에 insert
    const { error: roleError } = await this.supabase.from('user_roles').insert([{ user_id, role_id: roles }])

    if (roleError) {
      throw new Error(`권한 등록 실패: ${roleError.message}`)
    }
  }

  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle()

    if (error) {
      throw new Error(`사용자 조회 실패: ${error.message}`)
    }

    if (!data) {
      return null
    }

    return new User(
      data.user_id,
      data.username,
      data.email,
      data.password,
      data.nickname,
      data.phone,
      data.profile_img_url,
      data.provider,
      data.provider_id,
      data.created_at,
      data.updated_at,
    )
  }

  async signin(user: User): Promise<void> {
    // TODO: 로그인 로직 구현
    throw new Error('Method not implemented.')
  }

  async signout(): Promise<void> {
    // TODO: 로그아웃 로직 구현
    throw new Error('Method not implemented.')
  }

  async passwordFind(): Promise<User> {
    // TODO: 비밀번호 찾기 로직 구현
    throw new Error('Method not implemented.')
  }

  async passwordReset(user: User): Promise<void> {
    // TODO: 비밀번호 재설정 로직 구현
    throw new Error('Method not implemented.')
  }

  async emailFind(): Promise<User> {
    // TODO: 이메일 찾기 로직 구현
    throw new Error('Method not implemented.')
  }
}
