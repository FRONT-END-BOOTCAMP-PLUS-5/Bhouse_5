// src/components/common/CircleButton/CircleButton.tsx
'use client'

import React from 'react'
// next/image는 CircleButton 내부에서 직접 사용하지 않으므로 임포트에서 제거 가능합니다.
// 하지만 사용자 프로필 이미지와 같이 next/image를 사용할 경우,
// CircleButton의 icon prop으로 <Image> 컴포넌트를 직접 전달하게 될 것입니다.
import styles from './CircleButton.module.css'

interface CircleButtonProps {
  // 아이콘을 직접 React 노드로 받습니다.
  // 이제 <BellIcon fill="white" /> 나 <Image src="..." alt="..." /> 와 같은 형태를 전달할 수 있습니다.
  icon: React.ReactNode
  iconAlt?: string
  // iconSize도 icon prop으로 전달되는 컴포넌트에서 직접 크기를 제어하므로 제거합니다.
  bgColor?: string // 버튼 배경 색상
  size?: number // 버튼 크기 (지름 px)
  onClick?: () => void
}

const CircleButton: React.FC<CircleButtonProps> = ({ icon, bgColor, size = 40, onClick }) => {
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
      {/* icon prop으로 전달된 요소를 직접 렌더링합니다. */}
      {icon}
    </button>
  )
}

{
  /* <CircleButton
          icon={<FileIcon width={40} height={40} fill="red" />} // iconSize 대신 width, height를 직접 지정합니다. 상단에서 import한 아이콘을 가져옵니다.
          //사용할 svg아이콘의 파일에서 fill값을 "currentColor"로 지정해야 색상을 바꿀 수 있습니다. (예시 파일 : bell, file, trash 수정하였음.)
          iconAlt="파일" // iconAlt는 CircleButton 인터페이스에는 있지만, FileIcon 컴포넌트 자체에서 alt를 관리할 수도 있습니다.
          bgColor="#ffebee"
          size={90}
          onClick={() => alert('파일 아이콘 클릭')} // onClick 메시지를 더 구체적으로 변경했습니다.
        /> */
}
export default CircleButton
