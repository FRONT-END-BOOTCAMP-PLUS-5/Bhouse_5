import { supabaseClient } from '@bUtils/supabaseClient'
import { Post } from '@domain/entities/Post'

export class CreatePostUseCase {
  async execute(post: Omit<Post, 'post_id' | 'created_at' | 'hits'>): Promise<Post> {
    const { data, error } = await supabaseClient
      .from('community_posts')
      .insert({ ...post })
      .select(`*`)
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
      undefined,
      undefined,
    )
  }
}
