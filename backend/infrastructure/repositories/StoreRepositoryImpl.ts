import { StoreRepository } from '@domain/repositories/StoreRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { BoardgameStoreDto } from '@application/boardgames/stores/dtos/BoardgameStoreDto'

export class StoreRepositoryImpl implements StoreRepository {
  async getStoresByBoardgameId(boardgameId: number): Promise<BoardgameStoreDto[]> {
    const { data, error } = await supabaseClient
      .from('store_own_boardgames')
      .select(
        `
        store_id,
        store_places (
          name,
          address
        )
      `,
      )
      .eq('boardgame_id', boardgameId)

    if (error) throw new Error(error.message)
    if (!data) return []

    return data
      .filter((entry) => {
        console.log(entry)
        return !!entry.store_places
      })
      .map((entry) => ({
        storeId: String(entry.store_id),
        storeName: entry.store_places.name,
        address: entry.store_places.address,
      }))
  }
}
