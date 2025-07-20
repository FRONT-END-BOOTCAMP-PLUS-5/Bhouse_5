import { z } from 'zod'

// 로그인 스키마 정의
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>

// 약관 동의 스키마 정의
export const agreementSchema = z.object({
  termsOfService: z.boolean().refine((val) => val === true, {
    message: '이용약관에 동의해주세요',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: '개인정보처리방침에 동의해주세요',
  }),
})

export type AgreementSchemaType = z.infer<typeof agreementSchema>
