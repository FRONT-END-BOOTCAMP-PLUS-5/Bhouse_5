'use client'

import TextInput from '@/_components/TextInput/TextInput'
import styles from './page.module.css'
import ListingElement from '@/_components/ListingElement/ListingElement'
import BoardgameSearch from './BoardgameSearch'

export default function BoardgameListForm() {
  return (
    <form className={styles.boardgameListForm}>
      <BoardgameSearch></BoardgameSearch>
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
