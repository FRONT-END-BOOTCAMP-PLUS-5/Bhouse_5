'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { agreementSchema, AgreementSchemaType } from 'models/schemas/auth.schema'
import { useForm } from 'react-hook-form'
import styles from './agreement.module.css'
import globalStyles from '@/page.module.css'
import { usePathname } from 'next/navigation'
import Button from '@/_components/Button/Button'

export default function AgreementPage() {
  const pathname = usePathname()

  console.log(pathname)
  const form = useForm<AgreementSchemaType>({
    resolver: zodResolver(agreementSchema),
    mode: 'all',
  })
  console.log(form.watch())
  const handleSubmit = (data: AgreementSchemaType) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
      <label className={styles.allAgreementLabel}>
        전체 동의합니다
        <input {...form.register('allAgreement')} type="checkbox" className={styles.checkbox} />
      </label>

      <div className={styles.checkboxContainer}>
        <label className={styles.label}>
          보드의집 이용약관 [필수]
          <input {...form.register('termsOfService')} type="checkbox" className={styles.checkbox} />
        </label>
        <pre className={`${styles.pre} ${globalStyles.body12}`}>
          {`여러분을 환영합니다.

보드게임을 사랑하는 사람들을 위한 커뮤니티 플랫폼 보드의집(이하 ‘서비스’)을 이용해 주셔서 감사합니다.
본 약관은 서비스를 제공하는 보드의집 운영팀과 이를 이용하는 회원(이하 ‘회원’) 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제1조 (약관의 효력 및 변경)
본 약관은 서비스에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.

운영자는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.

제2조 (서비스의 이용)
보드의집은 회원에게 온라인 커뮤니티, 게시판, 게임 리뷰, 거래 게시물 작성 등의 서비스를 제공합니다.

회원은 본 약관에 동의하고 회원 가입 후 서비스를 이용할 수 있습니다.

제3조 (회원의 의무)
회원은 가입 시 진실된 정보를 제공해야 하며, 타인의 정보를 도용해서는 안 됩니다.

회원은 서비스를 이용함에 있어 타인의 권리를 침해하거나 법령을 위반해서는 안 됩니다.

제4조 (운영자의 권리 및 책임)
운영자는 회원이 게시한 콘텐츠가 법령을 위반하거나 타인의 권리를 침해한다고 판단되는 경우 사전 통보 없이 삭제할 수 있습니다.

서비스의 안정적 운영을 위하여 일시적으로 서비스를 중단할 수 있습니다.

제5조 (게시물의 권리와 책임)
회원이 작성한 게시물의 저작권은 해당 회원에게 있으며, 보드의집은 서비스 운영 및 홍보를 위해 게시물을 사용할 수 있는 비독점적 사용권을 가집니다.
          `}
        </pre>
      </div>

      <div className={styles.checkboxContainer}>
        <label className={styles.label}>
          개인정보 수집 및 이용 동의서 [필수]
          <input {...form.register('termsOfService')} type="checkbox" className={styles.checkbox} />
        </label>
        <pre className={`${styles.pre} ${globalStyles.body12}`}>
          {`보드의집은 「개인정보 보호법」 등 관련 법령에 따라 귀하의 개인정보를 보호하며, 아래와 같은 항목에 대해 개인정보를 수집·이용합니다.

1. 수집하는 개인정보 항목
필수항목: 이름, 이메일, 휴대전화번호, 닉네임, 비밀번호

선택항목: 생년월일, 프로필 이미지

2. 수집 및 이용 목적
회원 가입 및 관리

서비스 제공 및 운영 (게시판 이용, 게임 거래, 알림 발송 등)

고객 문의 대응 및 민원 처리

마케팅 및 이벤트 정보 안내 (동의자에 한함)

3. 보유 및 이용 기간
회원 탈퇴 시 즉시 파기

단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관

4. 동의 거부 권리 안내
귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으며, 거부 시 회원 가입 및 일부 서비스 이용에 제한이 있을 수 있습니다.
          `}
        </pre>
      </div>

      <Button type="submit" variant="gray" size="medium">
        다음
      </Button>
    </form>
  )
}
