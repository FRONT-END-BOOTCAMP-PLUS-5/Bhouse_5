// backend/infrastructure/repositories/LikeRepositoryImpl.ts
import { LikeRepository } from '@domain/repositories/LikeRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { BoardGame } from '@be/domain/entities/Boardgame'

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

  async getLikedBoardgames(userId: string): Promise<BoardGame[]> {
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
          img_url,
          year_published
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
        const game = Array.isArray(games) ? games[0] : games
        return new BoardGame(
          game.boardgame_id,
          game.name,
          game.description,
          game.min_players,
          game.max_players,
          game.min_playtime,
          game.max_playtime,
          game.img_url,
          game.year_published,
        )
      })
      .filter((game) => game !== null)
  }
}
