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
      Array.isArray(data.users) && data.users[0] ? data.users[0].nickname : undefined,
      Array.isArray(data.users) && data.users[0] ? data.users[0].profile_img_url : undefined,
      (data as any).updated_at ? new Date((data as any).updated_at) : undefined,
      typeof (data as any).category_id === 'number' ? (data as any).category_id : undefined,
    )
  }

  async getPostList({
    categoryId,
    townName,
    isLoggedIn,
  }: {
    categoryId: number | null
    townName: string | null
    isLoggedIn: boolean
  }): Promise<{ data: Post[]; townName: string | null; total: number }> {
    console.log('🔍 [getPostList] Called with:')
    console.log('  categoryId:', categoryId)
    console.log('townName: ', townName)
    console.log('  isLoggedIn:', isLoggedIn)

    let query = supabaseClient.from('community_posts_with_comment_count').select('*')

    if (!isLoggedIn) {
      console.log('🛑 Not logged in: excluding category_id = 1 (모집)')
      query = query.neq('category_id', 1)
    }

    if (categoryId === 1 && isLoggedIn && townName !== null) {
      query = query.eq('town', townName)
    }

    if (categoryId !== null) {
      console.log(`📌 Applying category filter: category_id = ${categoryId}`)
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Supabase query error:', error.message)
      throw new Error(error.message)
    }

    console.log('📦 [getPostList] Retrieved rows:', data?.length)
    if (data) {
      console.log(
        '🏘️ Towns in data:',
        data.map((item) => item.town),
      )
    }

    const posts: Post[] = data.map((item) => {
      return new Post(
        item.post_id,
        item.user_id,
        item.title,
        item.content,
        new Date(item.created_at),
        item.town,
        item.hits,
        item.nickname ?? null,
        item.profile_img_url ?? null,
        item.updated_at ? new Date(item.updated_at) : undefined,
        typeof item.category_id === 'number' ? item.category_id : undefined,
        item.comment_count ?? 0,
      )
    })

    return { data: posts, townName: townName ?? null, total: posts.length }
  }

  async getPostById(postId: number): Promise<Post | null> {
    const { data, error } = await supabaseClient
      .from('community_post_detail_with_comment_count') // 👈 View 사용
      .select('*')
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
      data.town,
      data.hits,
      data.nickname ?? null,
      data.profile_img_url ?? null,
      data.updated_at ? new Date(data.updated_at) : undefined,
      typeof data.category_id === 'number' ? data.category_id : undefined,
      data.comment_count ?? 0, // ✅ 댓글 수
    )
  }
}
