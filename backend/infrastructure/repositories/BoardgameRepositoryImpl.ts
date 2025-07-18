import { Boardgame } from '@be/domain/entities/Boardgame'
import { supabaseClient } from '@bUtils/supabaseClient'
import BoardgameRepository from '@domain/repositories/BoardgameRepository'

export class BoardgameRepositoryImpl implements BoardgameRepository {
  async findBoardgameById(id: number): Promise<Boardgame | null> {
    console.log('Trying to find boardgame id:', id)
    const { data, error } = await supabaseClient
      .from('boardgames')
      .select(
        `
        boardgame_id,
        name,
        description,
        genre_id,
        min_players,
        max_players,
        min_playtime,
        max_playtime,
        difficulty,
        img_url,
        created_at,
        updated_at,
        updated_by,
        created_by
      `,
      )
      .eq('boardgame_id', id)
      .single()
    console.log('Supabase data:', data)
    console.log('Supabase error:', error)
    if (error || !data) return null

    return new Boardgame(
      data.boardgame_id,
      data.name,
      data.created_by,
      data.genre_id,
      data.description,
      data.min_players,
      data.max_players,
      data.min_playtime,
      data.max_playtime,
      data.difficulty,
      data.img_url,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.updated_by,
    )
  }

  async searchBoardgames(params: {
    name?: string
    genre?: string
    minPlayers?: number
    maxPlayers?: number
  }): Promise<Boardgame[]> {
    let query = supabaseClient.from('boardgames').select('*')

    if (params.name) query = query.ilike('name', `%${params.name}%`)
    if (params.genre) query = query.eq('genre_id', params.genre)
    if (params.minPlayers) query = query.gte('min_players', params.minPlayers)
    if (params.maxPlayers) query = query.lte('max_players', params.maxPlayers)

    const { data, error } = await query
    if (error) throw error

    return data.map(
      (b) =>
        new Boardgame(
          b.boardgame_id,
          b.name,
          b.created_by,
          b.genre_id,
          b.description,
          b.min_players,
          b.max_players,
          b.min_playtime,
          b.max_playtime,
          b.difficulty,
          b.img_url,
          b.created_at,
          b.updated_at,
          b.updated_by,
        ),
    )
  }

  async findByStoreId(storeId: number): Promise<Boardgame[]> {
    const { data, error } = await supabaseClient
      .from('store_own_boardgames')
      .select('boardgame_id, boardgames(name, img_url)')
      .eq('store_id', storeId)

    if (error) throw new Error(error.message)

    return data.map(
      (row: any) =>
        new Boardgame(
          row.boardgame_id,
          row.boardgames.name,
          'unknown', // createdBy, updatedBy 등은 null or placeholder
          0,
          null,
          null,
          null,
          null,
          null,
          null,
          row.boardgames.img_url,
          new Date(),
          new Date(),
          'unknown',
        ),
    )
  }
}
