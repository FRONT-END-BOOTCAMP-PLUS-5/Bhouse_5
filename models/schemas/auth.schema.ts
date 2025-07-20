import { z } from 'zod'

// 로그인 스키마 정의
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '올바른 이메일 형식을 입력해주세요'),
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

// 회원가입 스키마 정의
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '올바른 이메일 형식을 입력해주세요'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    passwordConfirm: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    username: z
      .string()
      .min(1, '성함을 입력해주세요')
      .regex(/^[a-zA-Z가-힣]+$/, '성함을 입력해주세요'),
    phone: z
      .string()
      .min(1, '휴대폰을 입력해주세요')
      .regex(/^[0-9]+$/, '숫자만 입력해주세요'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'], // 에러를 passwordConfirm 필드에 표시
  })

export type SignupSchemaType = z.infer<typeof signupSchema>
