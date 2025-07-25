'use client'
import React, { useState } from 'react'
import Image from 'next/image' // Image 컴포넌트를 사용하기 위해 임포트합니다.

import styles from './page.module.css'
import Button from './_components/Button/Button'
import Dropdown from './_components/Dropdown/Dropdown'
import TextInput from './_components/TextInput/TextInput'
import Divider from './_components/Divider/Divider'
import CircleButton from './_components/CircleButton/CircleButton'
import ListingElement from './_components/ListingElement/ListingElement'
import Toggle from './_components/Toggle/Toggle'

import FileIcon from '@public/icons/file.svg'
import Carousel from './_components/Carousel/Carousel'

export default function Home() {
  const [email, setEmail] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [selectedRegion, setSelectedRegion] = useState('중랑구')
  const [smallSelectedOption, setSmallSelectedOption] = React.useState('옵션 1')
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
  const [keyword, setKeyword] = useState('')

  const handleSmallOptionSelect = (option: string) => {
    setSmallSelectedOption(option)
    console.log(`${option} 선택됨`)
  }

  const handleKeywordRegister = () => {
    // 여기에 키워드 등록 로직을 구현합니다.
    console.log(`등록할 키워드: ${keyword}`)
    alert(`'${keyword}' 키워드가 등록되었습니다!`)
    setKeyword('') // 등록 후 입력 필드 초기화
  }

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    console.log(`${region} 선택됨`)
    // 드롭다운 닫는 로직은 Dropdown 컴포넌트 내부에서 처리됩니다.
  }

  const handleAddLocationClick = () => {
    console.log('내 동네 추가하기 버튼 클릭')
    // 새 동네 추가 로직
  }

  return (
    <div className={styles.page}>
      <Carousel
        items={[
          {
            content: (
              <Image
                src="https://images.unsplash.com/photo-1602524810970-7ea5af66c84a?auto=format&fit=crop&w=800&q=80"
                alt="Ad 1"
                width={800}
                height={300}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ),
            href: 'https://naver.com',
          },
          {
            content: (
              <Image
                src="https://images.unsplash.com/photo-1526040652367-ac003a0475fe?auto=format&fit=crop&w=800&q=80"
                alt="Ad 2"
                width={800}
                height={300}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ),
            href: '/ads/2',
          },
        ]}
        autoPlay
        interval={10000}
      />
      <div>
        <CircleButton
          svgComponent={FileIcon} // BellIcon 컴포넌트를 직접 전달
          svgWidth={40} // 아이콘 너비
          svgHeight={40} // 아이콘 높이
          svgFill="red" // 아이콘 색상
          imageAlt="파일 아이콘" // 접근성용 대체 텍스트
          bgColor="#ffebee"
          size={90}
        />
      </div>
      <h3>버튼이 포함된 TextInput (피그마 이미지처럼)</h3>
      <TextInput
        type="text"
        placeholder="게시글 알림 받을 키워드 추가하기"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        hasButton={true} // ★ 버튼을 활성화합니다.
        buttonLabel="등록" // ★ 버튼에 표시될 텍스트입니다.
        onButtonClick={handleKeywordRegister} // ★ 버튼 클릭 시 실행될 함수입니다.
      />
      <p style={{ fontSize: '14px', color: '#666' }}>버튼이 포함된 TextInput의 현재 키워드: {keyword}</p>
      <ListingElement
        label={'엘레멘트입니다'}
        onDelete={function (): void {
          throw new Error('Function not implemented.')
        }}
      />
      <p className={styles.title48}>보드의 집</p>
      <p className={styles.title48}>보드의 집 title48텍스트입니다.</p>
      <Divider />
      <h1 className={styles.body16}>환영합니다! 이것은 본문 텍스트 body 16입니다.</h1>
      <Divider marginY="8px" />
      <p className={styles.header20}>이것은 본문보다 살짝 큰 header20 텍스트입니다.</p>
      <p className={styles.header48}>이것은 페이지 타이틀을 담당하는 header48입니다. </p>
      <p className={styles.extraBoldText}>이것은 나눔스퀘어 엑스트라볼드 텍스트입니다.</p>

      <h3>알림 설정</h3>
      <Toggle checked={isNotificationsEnabled} onChange={setIsNotificationsEnabled} size="medium" />
      <p>알림 {isNotificationsEnabled ? '켜짐' : '꺼짐'}</p>

      <Button borderRadius="8" variant="secondaryWhite">
        기본 버튼
      </Button>
      <Button variant="primary" onClick={() => console.log('Primary Clicked')}>
        로그인하기
      </Button>

      {/* --light-gray 색상의 비활성화된 버튼 (가입완료) */}
      <Button variant="primary" disabled={true}>
        가입완료
      </Button>

      {/* 새로운 secondaryBlue100 스타일 버튼 */}
      <Button variant="secondary" onClick={() => console.log('Secondary Blue 100 Clicked')}>
        다른 기능
      </Button>

      {/* 새로운 secondaryBlue400 스타일 버튼 */}
      <Button variant="secondary" onClick={() => console.log('Secondary Blue 400 Clicked')}>
        강조 기능
      </Button>
      <Button borderRadius="60" variant="ghost" size="small">
        아주 둥근 버튼
      </Button>
      <Button borderRadius="12" variant="primary" size="large" onClick={() => alert('클릭!')}>
        클릭! 하십시오. 저는 큰 버튼입니다.
      </Button>

      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // 가로 길이를 화면 비율에 맞춰 늘리고 싶다면 width: 100%를 className으로 전달
          className={styles.fullWidthInput} // CSS 모듈에 .fullWidthInput 정의 필요
        />
      </div>

      {/* 피그마의 '지금 인기있는 보드게임은?' 부분 - 검색 입력 */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="text"
          placeholder="지금 인기있는 보드게임은?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.fixedWidthInput}
        />
      </div>

      {/* 여러 줄 입력 (Textarea) 예시 */}
      <div style={{ marginBottom: '20px' }}>
        <TextInput
          type="textarea"
          placeholder="여기에 상세 설명을 입력하세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.fullWidthTextarea}
        />
      </div>

      {/* small 크기 텍스트 입력창 */}
      <TextInput type="text" placeholder="작은 입력" style={{ marginTop: '10px' }} />

      {/* 드롭다운 (회색 배경, round 8) */}
      <Dropdown label={selectedRegion}>
        <li onClick={() => handleRegionSelect('중랑구')}>중랑구</li>
        <li onClick={() => handleRegionSelect('은평구')}>은평구</li>
        <li onClick={() => handleRegionSelect('강남구')}>강남구</li>
        {/* data-disabled 속성은 스타일링을 위한 것이며, 실제 이벤트 발생을 막으려면 onClick을 제거하거나 핸들러 내에서 return; 해야 합니다. */}
        <li onClick={() => handleRegionSelect('서초구')} data-disabled="true">
          서초구 (선택 불가)
        </li>
        <Divider marginY="8px" />
        <li>
          {/* 드롭다운 리스트 안에 Button 컴포넌트 활용 */}
          <Button
            onClick={handleAddLocationClick}
            variant="primary"
            size="small"
            borderRadius="8"
            className={styles.buttonAsListItem} // module.css에서 정의된 클래스 활용
          >
            내 동네 추가하기
          </Button>
        </li>
      </Dropdown>

      {/* 커스텀 색상 및 둥글기 드롭다운 예시 */}
      <Dropdown label="카테고리 선택" fillColor="#E8F5E9" borderRadius="16">
        <li onClick={() => console.log('식료품 선택')}>식료품</li>
        <li onClick={() => console.log('의류 선택')}>의류</li>
        <li onClick={() => console.log('전자제품 선택')}>전자제품</li>
      </Dropdown>

      {/* 최대 높이를 가진 드롭다운 예시 */}
      <Dropdown label="긴 리스트" maxHeight="150px">
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i} onClick={() => console.log(`아이템 ${i + 1} 선택`)}>
            아이템 {i + 1}
          </li>
        ))}
      </Dropdown>

      <Dropdown label={smallSelectedOption} borderRadius="8" size="small">
        {' '}
        {/* size="small" 추가 */}
        <li onClick={() => handleSmallOptionSelect('옵션 1')}>옵션 1</li>
        <li onClick={() => handleSmallOptionSelect('더 긴 옵션 2')}>더 긴 옵션 2</li>
        <li onClick={() => handleSmallOptionSelect('세 번째 옵션')}>세 번째 옵션</li>
      </Dropdown>

      <Dropdown
        label={selectedRegion}
        borderRadius="8" //
        size="small" //
        listBgColor="#FFEEEE" // 예시: 드롭다운 리스트 배경색을 연한 빨강으로
        listBorderRadius="12" // 예시: 드롭다운 리스트 모서리를 12px로 둥글게
      >
        {' '}
        {/* */}
        {/*FIXME : 유저 정보 내 town으로 변경하기*/}
        <li onClick={() => handleRegionSelect('중랑구')}>중랑구</li>
        <li onClick={() => handleRegionSelect('은평구')}>은평구</li>
        <li onClick={() => handleRegionSelect('강남구')}>강남구</li>
        <li onClick={() => handleRegionSelect('서초구')} data-disabled="true">
          서초구 (선택 불가)
        </li>
        <Divider marginY="8px" />
        <li>
          <Button
            onClick={handleAddLocationClick}
            variant="primary" //
            size="small" //
            borderRadius="8" //
            className={styles.buttonAsListItem} //
          >
            내 동네 추가하기
          </Button>
        </li>
      </Dropdown>
    </div>
  )
}
