// backend/infrastructure/repositories/BoardgameRepositoryImpl.ts
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
    let query = supabaseClient.from('boardgames').select(
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
        created_by,
        user_likes_boardgames(count) // user_likes_boardgames 테이블의 count를 가져오기 위한 서브쿼리
      `,
    )

    if (params.name) query = query.ilike('name', `%${params.name}%`)
    if (params.genre) query = query.eq('genre_id', params.genre)
    if (params.minPlayers) query = query.gte('min_players', params.minPlayers)
    if (params.maxPlayers) query = query.lte('max_players', params.maxPlayers)

    const { data, error } = await query
    if (error) throw error

    // Supabase에서 관계형 데이터를 가져올 때의 타입 처리 방식에 따라 Boardgame 엔티티를 생성합니다.
    return data.map((b: any) => {
      // b의 타입을 any로 지정하여 user_likes_boardgames(count)를 임시로 처리
      // user_likes_boardgames 서브쿼리 결과가 배열 형태이고, 그 안에 count가 있을 것으로 예상합니다.
      const likeCount = b.user_likes_boardgames?.[0]?.count || 0

      const boardgame = new Boardgame(
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
        new Date(b.created_at),
        new Date(b.updated_at),
        b.updated_by,
      )
      // UseCase에서 DTO 매핑 시 활용하도록 데이터를 가져오는 형태를 유지합니다.
      return { ...boardgame, likeCount } // UseCase에서 이 likeCount를 참조할 수 있도록 반환
    }) as (Boardgame & { likeCount: number })[] // 타입을 명시적으로 캐스팅하여 UseCase에서 접근 가능하도록 함
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
