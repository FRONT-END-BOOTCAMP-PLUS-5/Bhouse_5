import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'
import { UserTown } from '@be/domain/entities/UserTown'
import { supabaseClient } from '@bUtils/supabaseClient'
import { UserTownTable } from '../types/database'

const supabase = supabaseClient

export class UserTownRepositoryImpl implements UserTownRepository {
  async create(userId: string, townName: string, latitude: number, longitude: number): Promise<UserTown> {
    const { data, error } = await supabase
      .from('user_towns')
      .insert({
        user_id: userId,
        town_name: townName,
        latitude,
        longitude,
      })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message || '동네 인증 실패')

    return new UserTown(
      data.id,
      data.user_id,
      data.town_name,
      data.latitude,
      data.longitude,
      data.created_at,
      data.is_primary,
    )
  }

  async findByUserId(userId: string): Promise<UserTown[]> {
    const { data, error } = await supabase.from('user_towns').select('*').eq('user_id', userId)

    if (error || !data) throw new Error(error?.message || '동네 조회 실패')

    return data.map(
      (t: UserTownTable) =>
        new UserTown(t.id, t.user_id, t.town_name, t.latitude, t.longitude, t.created_at, t.is_primary),
    )
  }

  async delete(id: number, userId: string): Promise<void> {
    const { error } = await supabase.from('user_towns').delete().match({ id, user_id: userId })

    if (error) throw new Error(error.message)
  }
}
