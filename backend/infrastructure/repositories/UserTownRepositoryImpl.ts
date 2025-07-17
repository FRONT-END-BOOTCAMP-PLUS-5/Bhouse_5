import { UserTownRepository } from '@be/domain/repositories/UserTownRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { CreateUserTownDto, UserTownDto } from '@be/application/user/certify-town/dtos/UserTownDto'
import { UserTownTable } from '../types/database'

const supabase = supabaseClient

export class UserTownRepositoryImpl implements UserTownRepository {
  async create(dto: CreateUserTownDto): Promise<UserTownDto> {
    const { data, error } = await supabase
      .from('user_towns')
      .insert({
        user_id: dto.userId,
        town_name: dto.townName,
        latitude: dto.lat,
        longitude: dto.lng,
      })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message || '동네 인증 실패')

    return this.toDto(data)
  }

  async findByUserId(userId: string): Promise<UserTownDto[]> {
    const { data, error } = await supabase
      .from('user_towns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error || !data) throw new Error(error?.message || '동네 조회 실패')

    return data.map((row: UserTownTable) => this.toDto(row))
  }

  async delete(dto: { userId: string; townName: string }): Promise<void> {
    const { error } = await supabase.from('user_towns').delete().match({ user_id: dto.userId, town_name: dto.townName })

    if (error) throw new Error(error.message)
  }

  async setPrimary(userId: string, townName: string): Promise<void> {
    const { error: unsetError } = await supabase.from('user_towns').update({ is_primary: false }).eq('user_id', userId)

    if (unsetError) throw new Error(unsetError.message)

    const { error: setError } = await supabase
      .from('user_towns')
      .update({ is_primary: true })
      .match({ user_id: userId, town_name: townName })

    if (setError) throw new Error(setError.message)
  }

  private toDto(row: UserTownTable): UserTownDto {
    return {
      id: row.id,
      userId: row.user_id,
      townName: row.town_name,
      lat: row.latitude ?? 0,
      lng: row.longitude ?? 0,
      isPrimary: row.is_primary ?? false,
      createdAt: new Date(row.created_at),
    }
  }
}
