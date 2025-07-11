import { PostRepository } from '@domain/repositories/PostRepository'
import { Post } from '@domain/entities/Post'
import { supabaseClient } from '@bUtils/supabaseClient'

export class PostRepositoryImpl implements PostRepository {
  // updatePost(postId: number, title: string, content: string, userId: string): Promise<Post> {
  //   throw new Error('Method not implemented.');
  // }
  // deletePost(postId: number, userId: string): Promise<void> {
  //   throw new Error('Method not implemented.');
  // }
  // postPost(userId: string, title: string, content: string, town?: string): Promise<Post> {
  //   throw new Error('Method not implemented.');
  // }
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
          item.profiles?.nickname,
          item.profiles?.profile_img_url,
        ),
    )

    return { data: posts, total: count ?? 0 }
  }
}
