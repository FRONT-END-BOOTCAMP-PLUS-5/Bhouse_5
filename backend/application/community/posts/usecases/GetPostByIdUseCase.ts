// backend/application/community/posts/usecases/GetPostByIdUseCase.ts
import { supabaseClient } from '@bUtils/supabaseClient'
import { Post } from '@domain/entities/Post'

export class GetPostByIdUseCase {
  async execute(postId: number): Promise<Post | null> {
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

    if (error) {
      console.error('[GetPostByIdUseCase Error]', error)
      throw new Error(error.message || 'Unknown error')
    }

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
