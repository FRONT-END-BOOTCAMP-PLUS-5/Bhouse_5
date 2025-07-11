// backend/infrastructure/repositories/SupabaseBoardgameRepository.ts

import { supabaseClient } from '../../utils/supabaseClient' // 미리 정의된 Supabase 클라이언트 임포트
import BoardgameRepository from '@domain/repositories/BoardgameRepository'
import { Boardgame } from '@domain/entities/Boardgame'
import { BoardgameRelationsOptions } from '@domain/repositories/options/BoardgameRelationsOptions'
import { BoardgameGenre } from '@domain/entities/BoardgameGenre' // 필요한 경우 임포트

// Supabase의 boardgames 테이블에서 가져올 데이터의 타입 정의 (DB 스키마와 매핑)
interface BoardgameTable {
  boardgame_id: number
  name: string
  description: string | null
  min_players: number | null
  max_players: number | null
  created_by: string
  created_at: string // Supabase에서 가져올 때는 ISO 문자열
  updated_at: string // Supabase에서 가져올 때는 ISO 문자열
  updated_by: string
  min_playtime: number | null
  max_playtime: number | null
  difficulty: number | null
  genre_id: number
  img_url: string | null
  // 관계 테이블의 필드도 필요시 여기에 추가 (예: genre_name 등)
}

/**
 * Boardgame 엔티티와 Supabase 테이블 간의 매핑을 담당하는 Mapper 클래스입니다.
 */
class BoardgameMapper {
  /**
   * Supabase 테이블 데이터를 Boardgame 엔티티로 변환합니다.
   * @param data Supabase에서 조회된 보드게임 테이블 데이터
   * @returns Boardgame 엔티티
   */
  static toBoardgame(data: BoardgameTable): Boardgame {
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

  /**
   * Boardgame 엔티티를 Supabase 테이블 데이터 형식으로 변환합니다.
   * @param boardgame Boardgame 엔티티
   * @returns Supabase에 저장할 보드게임 테이블 데이터
   */
  static toBoardgameTable(boardgame: Boardgame): Omit<BoardgameTable, 'boardgame_id' | 'created_at'> {
    return {
      name: boardgame.name,
      description: boardgame.description,
      min_players: boardgame.minPlayers,
      max_players: boardgame.maxPlayers,
      created_by: boardgame.createdBy,
      updated_at: boardgame.updatedAt.toISOString(),
      updated_by: boardgame.updatedBy,
      min_playtime: boardgame.minPlaytime,
      max_playtime: boardgame.maxPlaytime,
      difficulty: boardgame.difficulty,
      genre_id: boardgame.genreId,
      img_url: boardgame.imgUrl,
    }
  }
}

/**
 * BoardgameRepository 인터페이스의 Supabase 구현체입니다.
 * 실제 Supabase 데이터베이스와 상호작용합니다.
 */
export class SupabaseBoardgameRepository implements BoardgameRepository {
  // supabaseClient는 이미 정의되어 있으므로 생성자에서 주입받지 않습니다.
  constructor() {}

  async save(boardgame: Boardgame): Promise<Boardgame> {
    const { data, error } = await supabaseClient
      .from('boardgames')
      .insert([BoardgameMapper.toBoardgameTable(boardgame)])
      .select() // 삽입된 레코드를 반환받기 위해 .select() 사용
      .single() // 단일 레코드 삽입이므로 .single() 사용

    if (error) throw new Error(`Failed to save boardgame: ${error.message}`)
    return BoardgameMapper.toBoardgame(data)
  }

  async findById(boardgameId: number, relations?: BoardgameRelationsOptions): Promise<Boardgame | null> {
    const query = supabaseClient
      .from('boardgames')
      .select('*') // 관계 포함 로직에 따라 변경될 수 있음
      .eq('boardgame_id', boardgameId)
      .single()

    // TODO: relations 옵션에 따른 JOIN 쿼리 로직 구현 (예: .select('*, users!created_by(*), boardgame_genres(*)') )

    const { data, error } = await query
    if (error) {
      if (error.code === 'PGRST116') return null // No rows found
      throw new Error(`Failed to fetch boardgame by ID: ${error.message}`)
    }
    return data ? BoardgameMapper.toBoardgame(data) : null
  }

  async findAll(relations?: BoardgameRelationsOptions): Promise<Boardgame[]> {
    const query = supabaseClient.from('boardgames').select('*')
    // TODO: relations 옵션에 따른 JOIN 쿼리 로직 구현

    const { data, error } = await query
    if (error) throw new Error(`Failed to fetch all boardgames: ${error.message}`)
    return (data ?? []).map((item: BoardgameTable) => BoardgameMapper.toBoardgame(item))
  }
}
