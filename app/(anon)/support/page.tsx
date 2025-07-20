// app/support/page.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import Carousel from '@/_components/Carousel/Carousel' // 캐러셀 컴포넌트 임포트
import AccordionItem from './_components/AccordionItem' // 새로 만들 아코디언 컴포넌트 임포트
import InquiryForm from './_components/InquiryForm' // 새로 만들 아코디언 컴포넌트 임포트
import globalStyles from '@/page.module.css' // 전역 스타일 임포트
import styles from './supportPage.module.css' // 페이지 전용 스타일 임포트

export default function SupportPage() {
  return (
    <main className={globalStyles.page}>
      <div className={styles.container}>
        <Carousel
          items={[
            {
              content: (
                <Image
                  src="/images/banner1.png"
                  alt="Ad 1"
                  width={612}
                  height={408}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ),
              href: '/store-register',
            },
            {
              content: (
                <Image
                  src="/images/banner2.png"
                  alt="Ad 3"
                  width={800}
                  height={300}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ),
              href: '/boardgames',
            },
            {
              content: (
                <Image
                  src="/images/banner3.png"
                  alt="Ad 3"
                  width={800}
                  height={300}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ),
              href: '/community/posts',
            },
          ]}
          autoPlay
          interval={10000}
        />

        {/* 문의하기 섹션 제목 */}
        <h1 className={`${globalStyles.header48} ${styles.sectionTitle}`}>문의하기</h1>

        {/* FAQ 아코디언 목록 */}
        <div className={styles.accordionList}>
          <AccordionItem
            title="자주 묻는 질문"
            initialOpen={true} // 첫 번째 항목은 기본적으로 열려있도록
          >
            <p>자주 묻는 질문을 확인하고, 찾으시는 내용이 없다면 문의를 남겨주세요!</p>
          </AccordionItem>

          <AccordionItem title="회원 탈퇴 신청은 어떻게 하나요?">
            <p>
              회원 탈퇴는 마이페이지 &gt; 최하단 회원 탈퇴 버튼을 눌러 진행하실 수 있습니다. 탈퇴 시 모든 활동 정보가
              삭제되며 복구할 수 없습니다.
            </p>
          </AccordionItem>

          <AccordionItem title="이메일을 잊어버렸어요.">
            <p>
              이메일을 잊어버리신 경우, 로그인 페이지의 &quot;Forgot ID?&quot; 버튼을 눌러 이메일을 찾을 수 있습니다.
            </p>
          </AccordionItem>

          <AccordionItem title="비매너 유저를 신고하고 싶어요.">
            <p>비매너 유저 신고는 해당 유저의 프로필 페이지 또는 게시글/댓글에서 신고하기 버튼을 통해 가능합니다.</p>
          </AccordionItem>

          <AccordionItem title="새로운 보드게임을 등록하고 싶어요.">
            <p>고객지원을 통해 1:1 문의를 주시면 이용자님께서 찾은 새로운 보드게임을 등록해 드립니다.</p>
          </AccordionItem>
        </div>
        <InquiryForm />
      </div>
    </main>
  )
}
