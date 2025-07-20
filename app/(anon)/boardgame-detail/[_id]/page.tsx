import { use } from 'react'
import BoardgameDetailClient from './BoardgameDetailClient'

export default function BoardgameDetailPage({ params }: { params: Promise<{ _id: string }> }) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id } = use(params) // ✅ 비동기 unwrap
  const boardgameId = parseInt(_id, 10)

  return <BoardgameDetailClient id={boardgameId} />
}
