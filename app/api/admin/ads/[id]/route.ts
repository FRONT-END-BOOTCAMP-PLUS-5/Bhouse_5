// app/(backend)/api/admin/ads/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdUseCase } from '@be/application/admin/ads/usecases/GetAdUseCase'
import { UpdateAdUseCase } from '@be/application/admin/ads/usecases/UpdateAdUseCase'
import { DeleteAdUseCase } from '@be/application/admin/ads/usecases/DeleteAdUseCase'

const repo = new AdRepositoryImpl()
const getAdUseCase = new GetAdUseCase(repo)
const updateAdUseCase = new UpdateAdUseCase(repo)
const deleteAdUseCase = new DeleteAdUseCase(repo)

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

  try {
    const ad = await getAdUseCase.execute(id)
    if (!ad) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(ad)
  } catch (e) {
    console.error('GET error:', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

  try {
    const body = await req.json()
    await updateAdUseCase.execute(id, body)
    return NextResponse.json({ message: 'Ad updated' })
  } catch (e) {
    console.error('PATCH error:', e)
    return NextResponse.json({ message: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

  try {
    await deleteAdUseCase.execute(id)
    return new Response(null, { status: 204 }) // JSON이 아닌 Response 사용!
  } catch (e) {
    console.error('DELETE error:', e)
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 })
  }
}
