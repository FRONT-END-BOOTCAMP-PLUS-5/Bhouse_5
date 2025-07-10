import { BoardgameRepository } from '@domain/repositories/BoardgameRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { BoardGame } from '@be/domain/entities/boardgame'

//TODO: supabase에서 store_own_boardgames 테이블 더미데이터 넣기

export class BoardgameRepositoryImpl implements BoardgameRepository {
  async searchBoardgames(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): Promise<BoardGame[]> {
    let query = supabaseClient.from('boardgames').select('*')

    if (params.name) query = query.ilike('name', `%${params.name}%`)
    if (params.genre) query = query.eq('genre_id', params.genre)
    if (params.minPlayers) query = query.gte('min_players', params.minPlayers)
    if (params.maxPlayers) query = query.lte('max_players', params.maxPlayers)

    const { data, error } = await query
    if (error) throw error

    return data.map(
      (b) =>
        new BoardGame(
          b.boardgame_id,
          b.difficulty,
          b.name,
          b.img_url,
          b.min_players,
          b.max_players,
          b.min_playtime,
          b.max_playtime,
          b.year_published ?? 0,
          b.genre_id,
          b.description,
          b.created_at,
          b.updated_at,
        ),
    )
  }

  // backend/infrastructure/repositories/BoardgameRepositoryImpl.ts
  async getStoresByBoardgameId(
    boardgameId: number,
  ): Promise<{ storeId: string; storeName: string; address: string }[]> {
    const { data, error } = await supabaseClient
      .from('store_own_boardgames')
      .select('store_id, store_places(name, address)')
      .eq('boardgame_id', boardgameId)

    if (error) throw error

    return data
      .filter((entry) => Array.isArray(entry.store_places) && entry.store_places.length > 0)
      .map((entry) => ({
        storeId: entry.store_id,
        storeName: entry.store_places[0].name,
        address: entry.store_places[0].address,
      }))
  }
}
