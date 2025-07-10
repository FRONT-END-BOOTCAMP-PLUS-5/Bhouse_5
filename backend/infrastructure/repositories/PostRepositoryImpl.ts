import { IPostRepository } from '@domain/repositories/IPostRepository'
import { Post } from '@domain/entities/Post'
import { supabaseClient } from '@bUtils/supabaseClient'

export class PostRepositoryImpl implements IPostRepository {
  async deletePost(postId: number, userId: string): Promise<void> {
      const { error } = await supabaseClient
        .from('community_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)

      if (error) throw new Error(error.message)
  }

  async getPostById(postId: number): Promise<Post | null> {
    const { data, error } = await supabaseClient
      .from('community_posts')
      .select('*')
      .eq('post_id', postId)
      .single()

    if (error) throw new Error(error.message)
    return data ?? null
  }

  async postPost(userId: string, title: string, content: string, town?: string): Promise<Post> {
    const now = new Date().toISOString()
    const { data, error } = await supabaseClient
      .from('community_posts')
      .insert({
        user_id: userId,
        title,
        content,
        town,
        hits: 0,
        created_at: now,
        updated_at: now,
        updated_by: userId
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Post
  }

  async updatePost(postId: number, title: string, content: string, userId: string): Promise<Post> {
    const { data, error } = await supabaseClient
      .from('community_posts')
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .eq('post_id', postId)
      .select()
      .single()

    if (error || !data) {
      throw new Error('게시글 수정 실패')
    }

    return data
  }
}
