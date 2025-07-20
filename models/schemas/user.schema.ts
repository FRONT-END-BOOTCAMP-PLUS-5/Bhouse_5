import { z } from 'zod'

export const profileSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  profileImgUrl: z.string().optional(),
})

export type ProfileSchemaType = z.infer<typeof profileSchema>
