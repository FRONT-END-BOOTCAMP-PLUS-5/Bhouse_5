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
    nickname: z.string().min(1, '닉네임을 입력해주세요').max(20, '닉네임은 20자 이하로 입력해주세요'),
    phone: z
      .string()
      .min(1, '휴대폰을 입력해주세요')
      .regex(/^[0-9]+$/, '숫자만 입력해주세요'),
    roleId: z.number().optional(),
    businessNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'], // 에러를 passwordConfirm 필드에 표시
  })
  .refine(
    (data) => {
      // roleId가 3일 때만 businessNumber가 필수
      if (data.roleId === 3) {
        return data.businessNumber && data.businessNumber.length > 0
      }
      return true
    },
    {
      message: '사업자등록번호를 입력해주세요',
      path: ['businessNumber'],
    },
  )

export type SignupSchemaType = z.infer<typeof signupSchema>

export const findEmailSchema = z.object({
  username: z.string().min(1, '이름을 입력해주세요'),
  phone: z
    .string()
    .min(1, '휴대폰을 입력해주세요')
    .regex(/^[0-9]+$/, '숫자만 입력해주세요'),
})

export type FindEmailSchemaType = z.infer<typeof findEmailSchema>

export const findPasswordSchema = z.object({
  username: z.string().min(1, '이름을 입력해주세요'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '올바른 이메일 형식을 입력해주세요'),
  phone: z
    .string()
    .min(1, '휴대폰을 입력해주세요')
    .regex(/^[0-9]+$/, '숫자만 입력해주세요'),
})

export type FindPasswordSchemaType = z.infer<typeof findPasswordSchema>

export const passwordUpdateSchema = z
  .object({
    newPassword: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    passwordConfirm: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  })

export type PasswordUpdateSchemaType = z.infer<typeof passwordUpdateSchema>
