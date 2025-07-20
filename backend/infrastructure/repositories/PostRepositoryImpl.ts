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
    console.log('INSERT 응답:', data)
    if (error) throw new Error(error.message)

    return new Post(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      data.town,
      data.hits,
      (data.users as any)?.[0]?.nickname ?? null,
      (data.users as any)?.[0]?.profile_img_url ?? null,
    ) as any
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
      data.town,
      data.hits,
      Array.isArray(data.users) && data.users[0] ? data.users[0].nickname : undefined,
      Array.isArray(data.users) && data.users[0] ? data.users[0].profile_img_url : undefined,
      (data as any).updated_at ? new Date((data as any).updated_at) : undefined,
      typeof (data as any).category_id === 'number' ? (data as any).category_id : undefined,
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
          community_replies(count),
          users (
            nickname,
            profile_img_url
          )
        `,
      { count: 'exact' },
    )

    if (error) throw new Error(error.message)

    const posts: Post[] = data.map((item) => {
      const commentCount = (item as any).community_replies?.count ?? 0

      return new Post(
        item.post_id,
        item.user_id,
        item.title,
        item.content,
        new Date(item.created_at),
        item.town,
        item.hits,
        item.users?.nickname ?? null,
        item.users?.profile_img_url ?? null,
        (item as any).updated_at ? new Date((item as any).updated_at) : undefined,
        typeof (item as any).category_id === 'number' ? (item as any).category_id : undefined,
        commentCount, // Post entity에 필드 추가 필요
      )
    })

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
      ),
      community_replies(count)
    `,
      )
      .eq('post_id', postId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) return null

    const commentCount = (data as any)?.community_replies?.count ?? 0

    console.log('[DEBUG] users 조인 결과:', data.users)

    return new Post(
      data.post_id,
      data.user_id,
      data.title,
      data.content,
      new Date(data.created_at),
      data.town,
      data.hits,
      data.users?.nickname ?? null,
      data.users?.profile_img_url ?? null,
      data.updated_at ? new Date(data.updated_at) : undefined,
      typeof data.category_id === 'number' ? data.category_id : undefined,
      commentCount, // 🔥 댓글 수 추가
    )
  }
}
