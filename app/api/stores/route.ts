import { NextRequest, NextResponse } from 'next/server'
import { StoreRepositoryImpl } from '@be/infrastructure/repositories/StoreRepositoryImpl'
import { StoreSearchParams } from '@be/domain/entities/Store'

const repo = new StoreRepositoryImpl()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const params: StoreSearchParams = {
      keyword: searchParams.get('keyword') || undefined,
      address: searchParams.get('address') || undefined,
      ownerName: searchParams.get('ownerName') || undefined,
    }

    const stores = await repo.findByKeyword(params)
    return NextResponse.json(stores)
  } catch (error) {
    console.error('GET /stores error:', error)
    return NextResponse.json({ error: '매장 목록을 불러오지 못했습니다.' }, { status: 500 })
  }
}
