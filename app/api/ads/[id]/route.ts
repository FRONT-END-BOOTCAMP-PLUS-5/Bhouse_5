import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdUseCase } from '@be/application/admin/ads/usecases/GetAdUseCase'
import { verifyToken } from '@be/utils/auth' // ✅ JWT 검증 유틸 (Decodes + role check)

const repo = new AdRepositoryImpl()
const getAdUseCase = new GetAdUseCase(repo)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
  }

  try {
    const ad = await getAdUseCase.execute(id)
    if (!ad) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // 비공개 광고는 관리자만 조회 가능
    if (!ad.isActive) {
      const decoded = verifyToken(req)
      const isAdmin = decoded?.roleId === '1'
      if (!isAdmin) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json(ad)
  } catch (e) {
    console.error('GET error:', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
