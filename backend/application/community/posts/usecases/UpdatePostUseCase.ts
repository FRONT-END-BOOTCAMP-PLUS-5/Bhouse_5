import { supabaseClient } from '@bUtils/supabaseClient'

export class UpdatePostUseCase {
  async execute(postId: number, updates: { title: string; content: string; updated_by: string }): Promise<void> {
    const { error } = await supabaseClient
      .from('community_posts')
      .update({
        title: updates.title,
        content: updates.content,
        updated_by: updates.updated_by,
        updated_at: new Date().toISOString(),
      })
      .eq('post_id', postId)

    if (error) throw new Error(error.message)
  }
}
