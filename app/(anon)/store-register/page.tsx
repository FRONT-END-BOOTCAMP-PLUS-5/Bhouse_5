import Button from '@/_components/Button/Button'
import BoardgameListForm from './_components/BoardgameListForm'
import styles from './page.module.css'
import PlaceForm from './_components/PlaceForm'

//TODO: boardgameSearch 컴포넌트에서 목록 가져오는거 다시 만들기

export default function PlaceRegisterPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>매장 등록하기</h1>
      <PlaceForm />
      <BoardgameListForm />
      <Button className={styles.submitButton}>등록하기</Button>
    </div>
  )
}
