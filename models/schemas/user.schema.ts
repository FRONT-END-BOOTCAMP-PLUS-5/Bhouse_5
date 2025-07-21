import { z } from 'zod'

export const profileSchema = z
  .object({
    nickname: z.string().min(1, '닉네임을 입력해주세요'),
    profileImgUrl: z.string().optional(),
    password: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          // 빈 문자열이거나 undefined면 통과
          if (!val || val === '') return true
          // 값이 있으면 길이와 형식 검증
          return val.length >= 6 && /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(val)
        },
        {
          message: '비밀번호는 최소 6자 이상이며, 영어, 숫자, 특수기호만 사용 가능합니다',
        },
      ),
    passwordConfirm: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // 둘 다 비어있으면 통과
      if ((!data.password || data.password === '') && (!data.passwordConfirm || data.passwordConfirm === ''))
        return true
      // 둘 중 하나라도 입력되면 일치 검사
      return data.password === data.passwordConfirm
    },
    {
      message: '비밀번호가 일치하지 않습니다',
      path: ['passwordConfirm'],
    },
  )

export type ProfileSchemaType = z.infer<typeof profileSchema>
