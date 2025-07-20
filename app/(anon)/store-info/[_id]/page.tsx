'use client'

import { use } from 'react'
import PlaceDetailClient from './PlaceDetailClient'

export default function PlaceInfoPage({ params }: { params: Promise<{ _id: string }> }) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id } = use(params)
  const storeId = parseInt(_id, 10)

  if (isNaN(storeId)) {
    throw new Error(`Invalid store id: ${_id}`)
  }

  return (
    <div>
      <PlaceDetailClient storeId={storeId} />
    </div>
  )
}
