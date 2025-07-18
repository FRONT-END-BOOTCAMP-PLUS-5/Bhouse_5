import { Reply } from '@be/domain/entities/Reply'
import { supabaseClient } from '@bUtils/supabaseClient'
import ReplyRepository from '@domain/repositories/ReplyRepository'

export class ReplyRepositoryImpl implements ReplyRepository {
  async createReply(postId: number, userId: string, content: string, parentReplyId?: number): Promise<Reply> {
    const now = new Date().toISOString()

    const { data, error } = await supabaseClient
      .from('community_replies')
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        parent_reply_id: parentReplyId ?? null,
        created_at: now,
        updated_at: now,
      })
      .select(
        `
      reply_id,
      post_id,
      user_id,
      content,
      created_at,
      parent_reply_id,
      users (
        nickname,
        profile_img_url
      )
    `,
      )
      .single()

    if (error) throw new Error(error.message)

    return new Reply(
      data.reply_id,
      data.post_id,
      data.user_id,
      data.content,
      new Date(data.created_at),
      data.parent_reply_id ?? null,
    )
  }
}
