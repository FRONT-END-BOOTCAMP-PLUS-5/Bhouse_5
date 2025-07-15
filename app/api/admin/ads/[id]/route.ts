// app/(backend)/api/admin/ads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdUseCase } from '@be/application/admin/ads/usecases/GetAdUseCase'
import { UpdateAdUseCase } from '@be/application/admin/ads/usecases/UpdateAdUseCase'
import { DeleteAdUseCase } from '@be/application/admin/ads/usecases/DeleteAdUseCase'
import { supabaseClient } from '@bUtils/supabaseClient'

const repo = new AdRepositoryImpl()
const getAdUseCase = new GetAdUseCase(repo)
const updateAdUseCase = new UpdateAdUseCase(repo)
const deleteAdUseCase = new DeleteAdUseCase(repo)

// ✅ 관리자 여부 체크 함수
async function isAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) return false

  const { data, error } = await supabaseClient.from('users').select('role').eq('id', user.id).single()

  return !error && data?.role === 'ADMIN'
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

  try {
    const ad = await getAdUseCase.execute(id)
    if (!ad) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    // 비공개 광고는 관리자만 볼 수 있음
    if (!ad.isActive && !(await isAdmin())) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(ad)
  } catch (e) {
    console.error('GET error:', e)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

  if (!(await isAdmin())) {
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

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

  if (!(await isAdmin())) {
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
