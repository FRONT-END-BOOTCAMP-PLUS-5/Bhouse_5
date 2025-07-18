import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdListUseCase } from '@be/application/admin/ads/usecases/GetAdListUseCase'
import { verifyToken } from '@be/utils/auth' // ✅ JWT 검증 유틸 (Decodes + role check)

const repo = new AdRepositoryImpl()
const getAdListUseCase = new GetAdListUseCase(repo)

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyToken(req)
    const isAdmin = decoded?.roleId === '1'

    const ads = await getAdListUseCase.execute(isAdmin)
    return NextResponse.json(ads)
  } catch (e) {
    console.error('GET error', e)
    return NextResponse.json({ message: 'Failed to fetch ads' }, { status: 500 })
  }
}
