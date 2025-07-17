'use client'

import TextInput from '@/_components/TextInput/TextInput'
import styles from './page.module.css'
import Button from '@/_components/Button/Button'
import ListingElement from '@/_components/ListingElement/ListingElement'
import CircleButton from '@/_components/CircleButton/CircleButton'

export default function BoardgameListForm() {
  return (
    <form className={styles.boardgameListForm}>
      <TextInput placeholder="찾을 보드게임을 입력하세요" className={styles.searchBoardgameInput} />
      <div className={styles.boardgameList}>
        {/* 여기에 보드게임 목록을 렌더링할 예정 */}
        <ul className={styles.boardgameItems}>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
          <li>
            <ListingElement label="벚꽃 내리는 시대의 결투" onDelete={() => console.log('삭제 클릭됨')} />
          </li>
        </ul>
      </div>
    </form>
  )
}
