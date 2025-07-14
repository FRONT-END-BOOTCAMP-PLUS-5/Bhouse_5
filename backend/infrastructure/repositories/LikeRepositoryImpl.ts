import { supabaseClient } from '@bUtils/supabaseClient'
import { LikeRepository } from '@domain/repositories/LikeRepository'

export class LikeRepositoryImpl implements LikeRepository {
  async addLike(userId: string, boardgameId: number): Promise<void> {
    const { error } = await supabaseClient.from('user_likes').insert([{ user_id: userId, boardgame_id: boardgameId }])

    if (error) throw error
  }

  async deleteLike(userId: string, boardgameId: number): Promise<void> {
    const { error } = await supabaseClient
      .from('user_likes')
      .delete()
      .eq('user_id', userId)
      .eq('boardgame_id', boardgameId)

    if (error) throw error
  }

  async getLikedBoardgames(userId: string): Promise<number[]> {
    const { data, error } = await supabaseClient.from('user_likes').select('boardgame_id').eq('user_id', userId)

    if (error) throw error
    return data.map((row) => row.boardgame_id)
  }
}
