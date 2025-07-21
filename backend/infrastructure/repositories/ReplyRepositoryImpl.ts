import { Reply } from '@be/domain/entities/Reply'
import { supabaseClient } from '@bUtils/supabaseClient'
import ReplyRepository from '@domain/repositories/ReplyRepository'

// Type for Supabase response with joined users data
type ReplyWithUsers = {
  reply_id: number
  post_id: number
  user_id: string
  content: string
  created_at: string
  parent_reply_id: number | null
  users:
    | {
        nickname: string
        profile_img_url: string | null
      }[]
    | null
}
export class ReplyRepositoryImpl implements ReplyRepository {
  // ✅ CREATE
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
        parent_reply_id
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
      {
        nickname: '',
        profileImgUrl: null,
      },
    )
  }

  // ✅ READ - get all replies for a post
  async getRepliesByPostId(postId: number): Promise<Reply[]> {
    const { data, error } = await supabaseClient
      .from('community_replies')
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
      .eq('post_id', postId)
      .order('created_at', { ascending: true }) // 🔥 ASC 정렬

    if (error) throw new Error(error.message)

    return (data ?? []).map((r: ReplyWithUsers) => {
      return new Reply(r.reply_id, r.post_id, r.user_id, r.content, new Date(r.created_at), r.parent_reply_id ?? null, {
        nickname: r.users?.nickname || '',
        profileImgUrl: r.users?.profile_img_url || null,
      })
    })
  }

  async getRepliesByParentReplyId(parentReplyId: number): Promise<Reply[]> {
    const { data, error } = await supabaseClient
      .from('community_replies')
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
      .eq('parent_reply_id', parentReplyId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)

    return (data ?? []).map(
      (r) =>
        new Reply(r.reply_id, r.post_id, r.user_id, r.content, new Date(r.created_at), r.parent_reply_id ?? null, {
          nickname: r.users?.nickname || '',
          profileImgUrl: r.users?.profile_img_url || null,
        }),
    )
  }

  // ✅ READ - get single reply
  async getReplyById(replyId: number): Promise<Reply | null> {
    const { data, error } = await supabaseClient
      .from('community_replies')
      .select(
        `
        reply_id,
        post_id,
        user_id,
        content,
        created_at,
        parent_reply_id
      `,
      )
      .eq('reply_id', replyId)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) return null

    return new Reply(
      data.reply_id,
      data.post_id,
      data.user_id,
      data.content,
      new Date(data.created_at),
      data.parent_reply_id ?? null,
      {
        nickname: '',
        profileImgUrl: null,
      },
    )
  }

  // ✅ UPDATE - by replyId and userId
  async updateReply(replyId: number, userId: string, content: string): Promise<Reply> {
    const now = new Date().toISOString()

    const { data, error } = await supabaseClient
      .from('community_replies')
      .update({ content, updated_at: now })
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .select(
        `
        reply_id,
        post_id,
        user_id,
        content,
        created_at,
        parent_reply_id
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
      {
        nickname: '',
        profileImgUrl: null,
      },
    )
  }

  // ✅ DELETE - by replyId and userId
  async deleteReply(replyId: number, userId: string): Promise<void> {
    const { error } = await supabaseClient
      .from('community_replies')
      .delete()
      .eq('reply_id', replyId)
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
  }
}
