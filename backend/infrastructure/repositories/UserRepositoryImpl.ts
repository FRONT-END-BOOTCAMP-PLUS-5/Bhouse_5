import { User } from '@domain/entities/User'
import { UserRepository } from '@domain/repositories/UserRepository'
import { supabaseClient } from '@be/utils/supabaseClient'

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabaseClient
      .from('users')
      .select(
        `
        *,
        user_roles (
          roles (
            role_id,
            name
          )
        )
      `,
      )
      .eq('user_id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`사용자 조회 실패: ${error.message}`)
    }

    return new User(
      data.user_id,
      data.username,
      data.password,
      data.email,
      data.nickname,
      new Date(data.created_at),
      data.updated_at ? new Date(data.updated_at) : null,
      data.is_active,
      data.profile_img_url,
      data.phone,
      data.provider,
      data.provider_id,
      data.user_roles ? data.user_roles[0] : undefined, // Assuming user_roles is an array and we need the first element
    )
  }

  // 닉네임 중복 체크 메서드 추가
  async checkNicknameExists(nickname: string, excludeUserId?: string): Promise<boolean> {
    let query = supabaseClient.from('users').select('user_id').eq('nickname', nickname)

    if (excludeUserId) {
      query = query.neq('user_id', excludeUserId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      throw new Error(`닉네임 중복 체크 실패: ${error.message}`)
    }

    return !!data
  }

  async update(user: User): Promise<User> {
    // 닉네임이 변경되는 경우 중복 체크
    if (user.nickname) {
      const nicknameExists = await this.checkNicknameExists(user.nickname, user.id)
      if (nicknameExists) {
        throw new Error('이미 사용 중인 닉네임입니다.')
      }
    }

    const { error } = await supabaseClient
      .from('users')
      .update({
        username: user.username,
        nickname: user.nickname,
        profile_img_url: user.profileImgUrl,
        password: user.password,
        // 필요한 필드 추가
      })
      .eq('user_id', user.id)
      .single()

    if (error) throw new Error(`유저 업데이트 실패: ${error.message}`)

    return user
  }
}
