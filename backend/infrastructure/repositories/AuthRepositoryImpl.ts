import User from '@be/domain/entities/User'
import UserRole from '@be/domain/entities/UserRole'
import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { supabaseClient } from '@bUtils/supabaseClient'

export class AuthRepositoryImpl implements AuthRepository {
  async signup(user: User, roles: number): Promise<void> {
    // 1. users 테이블에 insert
    const { data, error } = await supabaseClient
      .from('users')
      .insert([
        {
          username: user.username,
          email: user.email,
          password: user.password,
          nickname: user.nickname,
          phone: user.phone,
          profile_img_url: user.image,
          provider: user.provider,
          provider_id: user.providerId,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      ])
      .select('user_id')

    if (error || !data || !data[0]?.user_id) {
      throw new Error(`회원가입 실패: ${error?.message}`)
    }

    const userId = data[0].user_id

    // 2. user_roles 테이블에 insert
    const { error: roleError } = await supabaseClient.from('user_roles').insert([{ user_id: userId, role_id: roles }])

    if (roleError) {
      throw new Error(`권한 등록 실패: ${roleError.message}`)
    }
  }

  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    const { data, error } = await supabaseClient
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
      data.password,
      data.email,
      data.nickname,
      data.created_at,
      data.updated_at,
      data.profile_img_url,
      new UserRole(data.user_id, 1), // 임시 UserRole - 나중에 실제 데이터로 교체
      undefined, // userAlarms - 나중에 별도로 로드
      data.phone,
      data.provider,
      data.provider_id,
    )
  }

  async signin(): Promise<void> {
    // TODO(@채영): 로그인 로직 구현
    await Promise.resolve() // 임시 await 추가
    throw new Error('Method not implemented.')
  }

  async signout(): Promise<void> {
    // TODO(@채영): 로그아웃 로직 구현
    await Promise.resolve() // 임시 await 추가
    throw new Error('Method not implemented.')
  }

  async passwordFind(): Promise<User> {
    // TODO(@채영): 비밀번호 찾기 로직 구현
    await Promise.resolve() // 임시 await 추가
    throw new Error('Method not implemented.')
  }

  async passwordReset(): Promise<void> {
    // TODO(@채영): 비밀번호 재설정 로직 구현
    await Promise.resolve() // 임시 await 추가
    throw new Error('Method not implemented.')
  }

  async emailFind(): Promise<User> {
    // TODO(@채영): 이메일 찾기 로직 구현
    await Promise.resolve() // 임시 await 추가
    throw new Error('Method not implemented.')
  }
}
