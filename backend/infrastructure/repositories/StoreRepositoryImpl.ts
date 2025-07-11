import { supabaseClient } from '@bUtils/supabaseClient'
import { Mapper } from '../mappers/Mapper'
import { StoreRepository, StoreSearchParams } from '@be/domain/repositories/StoreRepository'
import { Store } from '@be/domain/entities/Store'
import { StoreTable } from '../types/database'
import { getCurrentUserId, getCurrentUserRole } from '@bUtils/constantfunctions'

// Type for store data with user relationship from Supabase
interface StoreWithUser extends Omit<StoreTable, 'created_by'> {
  created_by: string
  users: { username: string }[] | null
}

export class StoreRepositoryImpl implements StoreRepository {
  async findAll(): Promise<Store[]> {
    const { data, error } = await supabaseClient.from('store_places').select(`
      store_id,
      name,
      address,
      phone,
      description,
      image_place_url,
      image_menu_url,
      created_by,
      open_time,
      users:created_by (
        username
      )
    `)
    if (error) throw error
    return data.map(
      (d: StoreWithUser) =>
        new Store(
          d.store_id,
          d.name,
          d.address,
          d.phone,
          d.description,
          d.image_place_url,
          d.image_menu_url,
          '',
          d.users?.username ?? '',
          d.open_time,
        ),
    )
  }

  async findById(id: number): Promise<Store | null> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(
        `
      store_id,
      name,
      address,
      phone,
      description,
      image_place_url,
      image_menu_url,
      created_by,
      open_time,
      users:created_by (
        username
      )
    `,
      )
      .eq('store_id', id)
      .single()

    if (error) throw error

    return data
      ? new Store(
          data.store_id,
          data.name,
          data.address,
          data.phone,
          data.description,
          data.image_place_url,
          data.image_menu_url,
          '',
          data.users?.username ?? '',
          data.open_time,
        )
      : null
  }

  async findByUserId(userId: string): Promise<Store[]> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(
        `
      store_id,
      name,
      address,
      phone,
      description,
      image_place_url,
      image_menu_url,
      created_by,
      open_time,
      users:created_by (
        username
      )
    `,
      )
      .eq('created_by', userId)

    if (error) throw error

    return data
      ? data.map(
          (d) =>
            new Store(
              d.store_id,
              d.name,
              d.address,
              d.phone,
              d.description,
              d.image_place_url,
              d.image_menu_url,
              '',
              d.users?.username ?? '',
              d.open_time,
            ),
        )
      : []
  }

  async findByKeyword(params: StoreSearchParams): Promise<Store[]> {
    let query = supabaseClient.from('store_places').select(`
      store_id,
      name,
      address,
      phone,
      description,
      image_place_url,
      image_menu_url,
      created_by,
      open_time,
      users:created_by (
        username
      )
    `) // ✅ join

    if (params.keyword) {
      query = query.ilike('name', `%${params.keyword}%`)
    }

    if (params.address) {
      query = query.ilike('address', `%${params.address}%`)
    }

    if (params.ownerName) {
      query = query.ilike('users.username', `%${params.ownerName}%`)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data
      ? data.map(
          (d) =>
            new Store(
              d.store_id,
              d.name,
              d.address,
              d.phone,
              d.description,
              d.image_place_url,
              d.image_menu_url,
              '',
              d.users?.username ?? '', // ✅ 배열 아님
              d.open_time,
            ),
        )
      : []
  }

  async create(store: Store): Promise<void> {
    const userId = await getCurrentUserId()
    const storeWithUserId = new Store(
      store.storeId,
      store.name,
      store.address,
      store.phone,
      store.description,
      store.imagePlaceUrl,
      store.imageMenuUrl,
      userId, // Override createdBy with current user
      store.ownerName, // Override ownerName with current user's name
      store.openTime,
    )
    const storeTable = Mapper.toStoreTable(storeWithUserId)
    const { error } = await supabaseClient.from('store_places').insert(storeTable)
    if (error) throw error
  }

  async update(id: number, createdBy: string, updateData: Partial<Store>): Promise<void> {
    const userId = await getCurrentUserId()
    const role = await getCurrentUserRole()

    // 권한 확인: 관리자가 아니고 작성자도 아니라면 예외
    if (role !== 'admin' && userId !== createdBy) {
      throw new Error('매장을 수정할 권한이 없습니다.')
    }

    const tempStore = new Store(
      id,
      updateData.name || '',
      updateData.address || '',
      updateData.phone || '',
      updateData.description || '',
      updateData.imagePlaceUrl || '',
      updateData.imageMenuUrl || '',
      createdBy,
      updateData.ownerName || '',
      updateData.openTime || '',
    )

    const storeTable = Mapper.toStoreTable(tempStore)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { store_id, created_by, ...updateFields } = storeTable

    const cleanUpdateFields = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined && value !== ''),
    )

    const { error } = await supabaseClient.from('store_places').update(cleanUpdateFields).eq('store_id', id)

    if (error) throw error
  }

  async delete(id: number): Promise<void> {
    const userId = await getCurrentUserId()
    const role = await getCurrentUserRole()

    // 먼저 해당 매장의 created_by를 가져옴
    const { data: store, error } = await supabaseClient
      .from('store_places')
      .select('created_by')
      .eq('store_id', id)
      .single()

    if (error || !store) {
      throw new Error('해당 매장을 찾을 수 없습니다.')
    }

    // 권한 확인
    if (role !== 'admin' && store.created_by !== userId) {
      throw new Error('매장을 삭제할 권한이 없습니다.')
    }

    const { error: deleteError } = await supabaseClient.from('store_places').delete().eq('store_id', id)

    if (deleteError) throw deleteError
  }
}
