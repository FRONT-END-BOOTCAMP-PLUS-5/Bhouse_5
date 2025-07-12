import { supabaseClient } from '@bUtils/supabaseClient'
import { Post } from '@domain/entities/Post'
import { PostRepository } from '@domain/repositories/PostRepository'

export class PostRepositoryImpl implements PostRepository {
  async postPost(userId: string, title: string, content: string, town?: string): Promise<Post> {
    const { data, error } = await supabaseClient
      .from('community_posts')
      .insert({
        user_id: userId,
        title,
        content,
        town,
      })
      .select(
        `
        post_id,
        user_id,
        title,
        content,
        created_at,
        town,
        hits,
        users (
          nickname,
          profile_img_url
        )
      `,
      )
      .single()

    if (error) throw new Error(error.message)

    return new Post(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      data.town,
      data.hits,
      data.users[0]?.nickname,
      data.users[0]?.profile_img_url,
    )
  }

  async deletePost(postId: number, userId: string): Promise<void> {
    const { error } = await supabaseClient.from('community_posts').delete().eq('post_id', postId).eq('user_id', userId)

    if (error) throw new Error(error.message)
  }

  async updatePost(postId: number, title: string, content: string, userId: string): Promise<Post> {
    const { data, error } = await supabaseClient
      .from('community_posts')
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq('post_id', postId)
      .select(
        `
        post_id,
        user_id,
        title,
        content,
        created_at,
        town,
        hits,
        users (
          nickname,
          profile_img_url
        )
      `,
      )
      .single()

    if (error) throw new Error(error.message)

    return new Post(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      data.town,
      data.hits,
      data.users[0]?.nickname,
      data.users[0]?.profile_img_url,
    )
  }

  async getPostList(): Promise<{ data: Post[]; total: number }> {
    const { data, count, error } = await supabaseClient.from('community_posts').select(
      `
        post_id,
        user_id,
        title,
        content,
        created_at,
        town,
        hits,
        users (
          nickname,
          profile_img_url
        )
      `,
      { count: 'exact' },
    )

    if (error) throw new Error(error.message)

    const posts: Post[] = data.map(
      (item) =>
        new Post(
          item.post_id,
          item.user_id,
          item.title,
          item.content,
          new Date(item.created_at),
          item.town,
          item.hits,
          item.users[0]?.nickname,
          item.users[0]?.profile_img_url,
        ),
    )

    return { data: posts, total: count ?? 0 }
  }

  async getPostById(postId: number): Promise<Post | null> {
    const { data, error } = await supabaseClient
      .from('community_posts')
      .select(
        `
        post_id,
        user_id,
        title,
        content,
        created_at,
        town,
        hits,
        users (
          nickname,
          profile_img_url
        )
      `,
      )
      .eq('post_id', postId)
      .single()

    if (error) throw new Error(error.message)
    if (!data) return null

    return new Post(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      data.town,
      data.hits,
      data.users[0]?.nickname,
      data.users[0]?.profile_img_url,
    )
  }
}
