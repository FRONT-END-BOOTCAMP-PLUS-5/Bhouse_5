import { StoreRepository } from '@domain/repositories/StoreRepository'
import { supabaseClient } from '@bUtils/supabaseClient'

export class StoreRepositoryImpl implements StoreRepository {
  async getStoresByBoardgameId(
    boardgameId: number,
  ): Promise<{ storeId: string; storeName: string; address: string }[]> {
    const { data, error } = await supabaseClient
      .from('store_own_boardgames')
      .select('store_id, store_places(name, address)')
      .eq('boardgame_id', boardgameId)

    if (error) throw error

    return data
      .filter((entry) => entry.store_places)
      .map((entry) => ({
        storeId: entry.store_id,
        storeName: entry.store_places[0]?.name,
        address: entry.store_places[0]?.address,
      }))
  }
}
