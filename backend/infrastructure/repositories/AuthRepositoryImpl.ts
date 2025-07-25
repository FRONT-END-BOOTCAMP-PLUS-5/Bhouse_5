import { User } from '@be/domain/entities/User'
import { AuthRepository } from '@be/domain/repositories/AuthRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { Mapper } from '../mappers/Mapper'
import { UserTable } from '../types/database'

export class AuthRepositoryImpl implements AuthRepository {
  async signup(user: User, roleId: number): Promise<void> {
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
          profile_img_url: user.profileImgUrl,
          provider: user.provider,
          provider_id: user.providerId,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      ])
      .select('user_id')

    if (error || !data || !data[0]?.user_id) {
      // 폰 번호 유니크 제약조건 에러 처리
      if (error?.message?.includes('duplicate key value') && error.message.includes('users_phone_key')) {
        throw new Error('이미 등록된 휴대폰 번호입니다.')
      }
      // 닉네임 유니크 제약조건 에러 처리
      if (error?.message?.includes('duplicate key value') && error.message.includes('users_nickname_key')) {
        throw new Error('이미 사용 중인 닉네임입니다.')
      }
      throw new Error(`회원가입 실패: ${error?.message}`)
    }

    const userId = data[0].user_id

    // 2. user_roles 테이블에 insert
    const { error: roleError } = await supabaseClient.from('user_roles').insert([{ user_id: userId, role_id: roleId }])

    if (roleError) {
      throw new Error(`권한 등록 실패: ${roleError.message}`)
    }
  }

  async findUser(email: string, username: string): Promise<User | null> {
    const { data, error } = await supabaseClient
      .from('users')
      .select(
        `
        *,
        user_roles!inner(role_id)
      `,
      )
      .eq('email', email) // 이메일만 체크
      .maybeSingle()

    console.log('data', data)

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
      data.deleted_at,
      data.profile_img_url,
      undefined, // userAlarms
      data.phone,
      data.provider,
      data.provider_id,
      data.user_roles?.role_id || null,
    )
  }

  async emailFind(username: string, phone: string): Promise<User | null> {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('phone', phone)
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
      data.deleted_at,
      data.profile_img_url,
      data.phone,
      data.provider,
      data.user_role,
    )
  }

  async passwordFind(username: string, email: string, phone: string): Promise<User | null> {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('email', email)
      .eq('phone', phone)
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
      data.deleted_at,
      data.profile_img_url,
      data.phone,
      data.provider,
      data.provider_id,
      data.user_role,
    )
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    const { data, error } = await supabaseClient
      .from('users')
      .select(
        `
        *,
        user_roles (
          role_id,
          role:roles (
            role_id,
            name
          )
        )
      `,
      )
      .eq('provider', provider)
      .eq('provider_id', providerId)
      .maybeSingle()

    if (error || !data) return null

    return Mapper.toUser(data as UserTable)
  }

  async passwordReset(userId: string, hashedPassword: string): Promise<void> {
    const { error } = await supabaseClient
      .from('users')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      throw new Error(`비밀번호 재설정 실패: ${error.message}`)
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabaseClient.from('users').select('*').eq('user_id', userId).maybeSingle()

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
      data.deleted_at,
      data.profile_img_url,
      data.phone,
      data.provider,
      data.provider_id,
      data.user_role,
    )
  }
}
