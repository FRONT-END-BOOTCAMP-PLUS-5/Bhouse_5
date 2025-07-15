import { BoardgameStoreDto } from '@application/boardgames/stores/dtos/BoardgameStoreDto'
import { supabaseClient } from '@bUtils/supabaseClient'
import { Mapper } from '../mappers/Mapper'
import { StoreRepository, StoreSearchParams } from '@be/domain/repositories/StoreRepository'
import { CreateStoreDto } from '@be/application/owner/stores/dtos/CreatedStoreDto'
import { ReadStoreDto } from '@be/application/owner/stores/dtos/ReadStoreDto'
import { UpdateStoreDto } from '@be/application/owner/stores/dtos/UpdateStoreDto'

export class StoreRepositoryImpl implements StoreRepository {
  async getStoresByBoardgameId(boardgameId: number): Promise<BoardgameStoreDto[]> {
    const { data, error } = await supabaseClient
      .from('store_own_boardgames')
      .select(`store_id, store_places (name, address)`) // 관계 테이블 구조
      .eq('boardgame_id', boardgameId)

    if (error) throw new Error(error.message)
    if (!data) return []

    return data
      .filter((entry) => !!entry.store_places && Array.isArray(entry.store_places) && entry.store_places.length > 0)
      .map((entry) => ({
        storeId: String(entry.store_id),
        storeName: entry.store_places[0].name,
        address: entry.store_places[0].address,
      }))
  }

  async findAll(): Promise<ReadStoreDto[]> {
    const { data, error } = await supabaseClient.from('store_places').select(`
      store_id, name, address, phone, description,
      image_place_url, image_menu_url, created_by, open_time,
      users:created_by (username)
    `)
    if (error) throw error
    return data ? data.map(Mapper.toReadStoreDtoFromTableRow) : []
  }

  async findById(id: number): Promise<ReadStoreDto | null> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(
        `
        store_id, name, address, phone, description,
        image_place_url, image_menu_url, created_by, open_time,
        users:created_by (username)
      `,
      )
      .eq('store_id', id)
      .single()

    if (error) throw error
    return data ? Mapper.toReadStoreDtoFromTableRow(data) : null
  }

  async findByUserId(userId: string): Promise<ReadStoreDto[]> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(
        `
        store_id, name, address, phone, description,
        image_place_url, image_menu_url, created_by, open_time,
        users:created_by (username)
      `,
      )
      .eq('created_by', userId)

    if (error) throw error
    return data ? data.map(Mapper.toReadStoreDtoFromTableRow) : []
  }

  async findByKeyword(params: StoreSearchParams): Promise<ReadStoreDto[]> {
    let query = supabaseClient.from('store_places').select(`
      store_id, name, address, phone, description,
      image_place_url, image_menu_url, created_by, open_time,
      users:created_by (username)
    `)

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

    return data ? data.map(Mapper.toReadStoreDtoFromTableRow) : []
  }

  async create(dto: CreateStoreDto): Promise<void> {
    const tableRow = Mapper.toStoreTableFromCreate(dto, dto.createdBy)
    const { error } = await supabaseClient.from('store_places').insert(tableRow)
    if (error) throw error
  }

  async update(id: number, dto: UpdateStoreDto): Promise<void> {
    const updateTable = Mapper.toUpdateStoreTable(dto)
    const cleanUpdate = Object.fromEntries(Object.entries(updateTable).filter(([, v]) => v !== undefined && v !== ''))

    const { error } = await supabaseClient
      .from('store_places')
      .update(cleanUpdate)
      .eq('store_id', id)
      .eq('created_by', dto.createdBy)

    if (error) throw error
  }

  async delete(id: number, createdBy: string, isAdmin: boolean): Promise<void> {
    const { data: store, error } = await supabaseClient
      .from('store_places')
      .select('created_by')
      .eq('store_id', id)
      .single()

    if (error || !store) {
      throw new Error('해당 매장을 찾을 수 없습니다.')
    }

    if (!isAdmin && store.created_by !== createdBy) {
      throw new Error('매장을 삭제할 권한이 없습니다.')
    }

    const { error: deleteError } = await supabaseClient.from('store_places').delete().eq('store_id', id)

    if (deleteError) throw deleteError
  }
}
