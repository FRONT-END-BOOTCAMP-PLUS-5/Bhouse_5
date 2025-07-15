// app/api/admin/ads/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdListUseCase } from '@be/application/admin/ads/usecases/GetAdListUseCase'
import { CreateAdUseCase } from '@be/application/admin/ads/usecases/CreateAdUseCase'
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto'
import { verifyToken } from '@be/utils/auth' // ✅ JWT 검증 유틸 (Decodes + role check)

const repo = new AdRepositoryImpl()
const getAdListUseCase = new GetAdListUseCase(repo)
const createAdUseCase = new CreateAdUseCase(repo)

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

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyToken(req)
    if (!decoded || decoded.roleId !== '1') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const dto: CreateAdDto = {
      title: body.title,
      imageUrl: body.imgUrl,
      redirectUrl: body.redirectUrl,
      isActive: body.isActive,
      type: body.type,
      description: body.description,
    }

    await createAdUseCase.execute(dto, decoded.userId) // ✅ userId 전달
    return NextResponse.json({ message: 'Ad created' }, { status: 201 })
  } catch (e) {
    console.error('POST error', e)
    return NextResponse.json({ message: 'Failed to create ad' }, { status: 500 })
  }
}
