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
      data.deleted_at ? new Date(data.deleted_at) : null,
      data.profile_img_url,
      data.phone,
      data.provider,
      data.provider_id,
      data.user_roles, // ← userRole 객체로 전달
    )
  }

  // 다른 메서드들은 차차 구현
  // async findAll(): Promise<User[]> {
  //   throw new Error('Not implemented')
  // }
  // async save(user: User): Promise<User> {
  //   throw new Error('Not implemented')
  // }
  async update(user: User): Promise<User> {
    const { data, error } = await supabaseClient
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
  // async delete(id: string): Promise<void> {
  //   throw new Error('Not implemented')
  // }
}
