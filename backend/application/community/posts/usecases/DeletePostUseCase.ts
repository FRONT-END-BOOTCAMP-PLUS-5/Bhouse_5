import { supabaseClient } from '@bUtils/supabaseClient'

export class DeletePostUseCase {
  async execute(postId: number): Promise<void> {
    const { error } = await supabaseClient.from('community_posts').delete().eq('post_id', postId)

    if (error) throw new Error(error.message)
  }
}
