import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdUseCase } from '@be/application/admin/ads/usecases/GetAdUseCase'
import { UpdateAdUseCase } from '@be/application/admin/ads/usecases/UpdateAdUseCase'
import { DeleteAdUseCase } from '@be/application/admin/ads/usecases/DeleteAdUseCase'
import { verifyToken } from '@be/utils/auth'

const repo = new AdRepositoryImpl()
const getAdUseCase = new GetAdUseCase(repo)
const updateAdUseCase = new UpdateAdUseCase(repo)
const deleteAdUseCase = new DeleteAdUseCase(repo)

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
  }

  const decoded = verifyToken(req)
  if (!decoded || decoded.roleId !== '1') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    await updateAdUseCase.execute(id, body)
    return NextResponse.json({ message: 'Ad updated' })
  } catch (e) {
    console.error('PATCH error:', e)
    return NextResponse.json({ message: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
  if (isNaN(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
  }

  const decoded = verifyToken(req)
  if (!decoded || decoded.roleId !== '1') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  try {
    await deleteAdUseCase.execute(id)
    return new Response(null, { status: 204 }) // No content
  } catch (e) {
    console.error('DELETE error:', e)
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 })
  }
}
