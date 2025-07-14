import { supabaseClient } from '@bUtils/supabaseClient'
import { Post } from '@domain/entities/Post'
import { PostRepository } from '@domain/repositories/PostRepository'

export class PostRepositoryImpl implements PostRepository {
  async postPost(userId: string, title: string, content: string, categoryId: number, town?: string): Promise<Post> {
    const now = new Date().toISOString()
    const { data, error } = await supabaseClient
      .from('community_posts')
      .insert({
        user_id: userId,
        title: title,
        content: content,
        category_id: categoryId,
        town: town,
        created_at: now,
        updated_at: now,
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

  // infrastructure/repositories/PostRepositoryImpl.ts
  async updatePost(
    postId: number,
    userId: string,
    title: string,
    content: string,
    categoryId?: number,
    town?: string,
  ): Promise<Post> {
    const now = new Date().toISOString()

    const { data, error } = await supabaseClient
      .from('community_posts')
      .update({
        title,
        content,
        category_id: categoryId,
        town,
        updated_at: now,
      })
      .eq('post_id', postId)
      .eq('user_id', userId)
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
      new Date(now),
      data.category_id,
      data.town,
      data.hits,
      data.users?.nickname ?? null,
      data.users?.profile_img_url ?? null,
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
          undefined, // updatedAt 생략 or 추가
          undefined, // categoryId 생략 or 추가
          item.town,
          item.hits,
          item.users?.nickname ?? null,
          item.users?.profile_img_url ?? null,
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
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) return null

    return new Post(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      data.updated_at ? new Date(data.updated_at) : undefined,
      data.category_id ?? undefined,
      data.town ?? undefined,
      data.hits ?? undefined,
      data.users?.nickname ?? undefined,
      data.users?.profile_img_url ?? undefined,
    )
  }
}
