import { supabaseClient } from '@bUtils/supabaseClient'
import { Post } from '@domain/entities/Post'

export class GetPostListUseCase {
  async execute(): Promise<{ data: Post[]; total: number }> {
    const { data, count, error } = await supabaseClient.from('community_posts').select(
      `
        post_id,
        user_id,
        title,
        content,
        created_at,
        town,
        hits,
        profiles (
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
          item.profiles?.[0]?.nickname,
          item.profiles?.[0]?.profile_img_url,
        ),
    )

    return { data: posts, total: count ?? 0 }
  }
}
