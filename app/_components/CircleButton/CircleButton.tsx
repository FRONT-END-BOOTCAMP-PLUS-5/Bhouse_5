// src/components/common/CircleButton/CircleButton.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import styles from './CircleButton.module.css'

interface CircleButtonProps {
  // 이미지 URL을 직접 받을 때 사용 (프로필 이미지 등)
  imageUrl?: string
  // 이미지 크기 (width, height에 모두 적용). 제공되지 않으면 CircleButton의 size를 따릅니다.
  imageSize?: number
  // 이미지 alt 텍스트 (imageUrl 사용 시 필수)
  imageAlt?: string // imageAlt는 필수로 받도록 변경되었으나, svgComponent 사용 시에는 필요 없을 수 있으므로 옵셔널로 변경

  // SVG 컴포넌트를 직접 받을 때 사용 (BellIcon 등)
  svgComponent?: React.ComponentType<{
    width?: number
    height?: number
    fill?: string
    [key: string]: any // 기타 SVG 컴포넌트가 받을 수 있는 속성들을 허용
  }>
  svgWidth?: number // SVG의 너비. 제공되지 않으면 CircleButton의 size를 따릅니다.
  svgHeight?: number // SVG의 높이. 제공되지 않으면 CircleButton의 size를 따릅니다.
  svgFill?: string // SVG의 fill 색상

  bgColor?: string // 버튼 배경 색상
  size?: number // 버튼 크기 (지름 px) - 기본값 40px
  onClick?: () => void
}

const CircleButton: React.FC<CircleButtonProps> = ({
  imageUrl,
  imageSize,
  imageAlt,
  svgComponent: SvgComponent, // prop 이름을 SvgComponent로 변경하여 JSX에서 태그처럼 사용 가능하게 함
  svgWidth,
  svgHeight,
  svgFill,
  bgColor,
  size = 40,
  onClick,
}) => {
  const finalImageSize = imageSize || size
  const finalSvgWidth = svgWidth || size
  const finalSvgHeight = svgHeight || size

  let renderedContent: React.ReactNode = null

  if (imageUrl) {
    renderedContent = (
      <Image
        src={imageUrl}
        alt={imageAlt || ''} // imageAlt가 없으면 빈 문자열로 설정 (필수 prop이 아니게 되었으므로)
        width={finalImageSize}
        height={finalImageSize}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
      />
    )
  } else if (SvgComponent) {
    // SvgComponent가 제공되면 해당 컴포넌트를 렌더링하고 prop 전달
    renderedContent = (
      <SvgComponent
        width={finalSvgWidth}
        height={finalSvgHeight}
        fill={svgFill}
        // 기타 필요한 SVG 컴포넌트 prop이 있다면 여기에 추가할 수 있습니다.
      />
    )
  }
  // imageUrl, SvgComponent 둘 다 제공되지 않으면 renderedContent는 null

  return (
    <button
      className={styles.button}
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
      }}
      onClick={onClick}
      type="button"
    >
      {renderedContent}
    </button>
  )
}

export default CircleButton
