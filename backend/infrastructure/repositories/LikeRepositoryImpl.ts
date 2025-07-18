// backend/infrastructure/repositories/LikeRepositoryImpl.ts
import { LikeRepository } from '@domain/repositories/LikeRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { Boardgame } from '@be/domain/entities/Boardgame'

//TODO: boardgame 인수 부족

export class LikeRepositoryImpl implements LikeRepository {
  async addLikedBoardgame(userId: string, boardgameId: number): Promise<void> {
    const { error } = await supabaseClient
      .from('user_likes_boardgames')
      .insert({ user_id: userId, boardgame_id: boardgameId })

    if (error) throw new Error(error.message)
  }

  async deleteLikedBoardgame(userId: string, boardgameId: number): Promise<void> {
    const { error } = await supabaseClient
      .from('user_likes_boardgames')
      .delete()
      .match({ user_id: userId, boardgame_id: boardgameId })

    if (error) throw new Error(error.message)
  }

  async getLikedBoardgames(userId: string): Promise<Boardgame[]> {
    const { data, error } = await supabaseClient
      .from('user_likes_boardgames')
      .select(
        `
      boardgames (
        boardgame_id,
        name,
        description,
        min_players,
        max_players,
        min_playtime,
        max_playtime,
        difficulty,
        img_url,
        year_published,
        created_by,
        genre_id,
        created_at,
        updated_at,
        updated_by
      )
    `,
      )
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
    if (!data) return []

    return data
      .map((item) => {
        const games = item.boardgames
        if (!games || games.length === 0) return null
        const game = games[0]

        return new Boardgame(
          game.boardgame_id,
          game.name,
          game.created_by,
          game.genre_id,
          game.description ?? null,
          game.min_players ?? null,
          game.max_players ?? null,
          game.min_playtime ?? null,
          game.max_playtime ?? null,
          game.difficulty ?? null,
          game.img_url ?? null,
          new Date(game.created_at),
          new Date(game.updated_at),
          game.updated_by,
        )
      })
      .filter((game): game is Boardgame => game !== null)
  }
}
