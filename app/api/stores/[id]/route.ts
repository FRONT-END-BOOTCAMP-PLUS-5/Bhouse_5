import { NextRequest, NextResponse } from 'next/server'
import { StoreRepositoryImpl } from '@be/infrastructure/repositories/StoreRepositoryImpl'

const repo = new StoreRepositoryImpl()

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: '유효한 ID가 아닙니다.' }, { status: 400 })
    }

    const store = await repo.findById(id)
    if (!store) {
      return NextResponse.json({ error: '매장을 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('GET /stores/[id] error:', error)
    return NextResponse.json({ error: '매장 조회에 실패했습니다.' }, { status: 500 })
  }
}
