import { NextRequest, NextResponse } from 'next/server'
import { StoreRepositoryImpl } from '@be/infrastructure/repositories/StoreRepositoryImpl'
import { Store } from '@be/domain/entities/Store'
import { verifyToken } from '@be/utils/auth'
import { UpdateStoreDto } from '@be/application/owner/stores/dtos/UpdateStoreDto'

const repo = new StoreRepositoryImpl()

// ✅ POST: 매장 생성 (OWNER만 가능)
export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded || decoded.roleId !== '3') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
    }

    const body = await req.json()
    const newStore = new Store(
      0,
      body.name,
      body.address,
      body.phone,
      body.description,
      body.imagePlaceUrl,
      body.imageMenuUrl,
      decoded.userId,
      '', // ownerName은 서버 쿼리에서 채워짐
      body.openTime,
    )

    await repo.create(newStore)
    return NextResponse.json({ message: '매장 생성 완료' }, { status: 201 })
  } catch (error) {
    console.error('POST /stores error:', error)
    return NextResponse.json({ error: '매장 생성에 실패했습니다.' }, { status: 500 })
  }
}

// ✅ PUT: 매장 수정 (ADMIN 또는 OWNER 본인만 가능)
export async function PUT(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 })
    }

    const body = await req.json()
    const storeId = body.storeId as number
    const createdBy = body.createdBy as string

    const isAdmin = decoded.roleId === '1'
    const isOwner = decoded.userId === createdBy
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: '매장 수정 권한 없음' }, { status: 403 })
    }

    const dto: UpdateStoreDto = body
    await repo.update(storeId, dto)
    return NextResponse.json({ message: '매장 수정 완료' })
  } catch (error: any) {
    console.error('PUT /stores error:', error)
    return NextResponse.json({ error: error.message || '매장 수정 실패' }, { status: 403 })
  }
}

// ✅ DELETE: 매장 삭제 (ADMIN 또는 OWNER 본인만 가능)
export async function DELETE(req: NextRequest) {
  try {
    const decoded = verifyToken(req)
    if (!decoded) {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 })
    }

    const body = await req.json()
    const storeId = body.storeId as number

    const isAdmin = decoded.roleId === '1'

    const store = await repo.findById(storeId)
    if (!store) {
      return NextResponse.json({ error: '해당 매장이 존재하지 않습니다.' }, { status: 404 })
    }

    const isOwner = store.createdBy === decoded.userId
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: '매장 삭제 권한 없음' }, { status: 403 })
    }

    await repo.delete(storeId, decoded.userId, isAdmin)
    return NextResponse.json({ message: '매장 삭제 완료' })
  } catch (error: any) {
    console.error('DELETE /stores error:', error)
    return NextResponse.json({ error: error.message || '매장 삭제 실패' }, { status: 403 })
  }
}
