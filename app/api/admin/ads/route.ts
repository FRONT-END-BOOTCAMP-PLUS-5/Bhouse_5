// app/api/admin/ads/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl'
import { GetAdListUseCase } from '@be/application/admin/ads/usecases/GetAdListUseCase'
import { CreateAdUseCase } from '@be/application/admin/ads/usecases/CreateAdUseCase'
import { Ad } from '@be/domain/entities/Ad'
import { supabaseClient } from '@bUtils/supabaseClient'
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto'

const repo = new AdRepositoryImpl()
const getAdListUseCase = new GetAdListUseCase(repo)
const createAdUseCase = new CreateAdUseCase(repo)

export async function GET() {
  try {
    const ads = await getAdListUseCase.execute()
    return NextResponse.json(ads)
  } catch (e) {
    console.error('GET error', e)
    return NextResponse.json({ message: 'Failed to fetch ads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user || user.user_metadata?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const dto: CreateAdDto = {
      title: body.title,
      imageUrl: body.imgUrl,
      redirectUrl: body.redirectUrl,
      isActive: body.isActive,
      type: body.type,
      description: body.description,
    }

    await createAdUseCase.execute(dto)
    return NextResponse.json({ message: 'Ad created' }, { status: 201 })
  } catch (e) {
    console.error('POST error', e)
    return NextResponse.json({ message: 'Failed to create ad' }, { status: 500 })
  }
}
