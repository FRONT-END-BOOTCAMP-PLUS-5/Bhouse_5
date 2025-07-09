// app/api/admin/ads/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { AdRepositoryImpl } from '@be/infrastructure/repositories/AdRepositoryImpl';
import { GetAdListUseCase } from '@be/application/admin/ads/usecases/GetAdListUseCase';
import { CreateAdUseCase } from '@be/application/admin/ads/usecases/CreateAdUseCase';
import { Ad } from '@be/domain/entities/Ad';
import { supabaseClient } from '@bUtils/supabaseClient';

const repo = new AdRepositoryImpl();
const getAdListUseCase = new GetAdListUseCase(repo);
const createAdUseCase = new CreateAdUseCase(repo);

export async function GET() {
  try {
    const ads = await getAdListUseCase.execute();
    return NextResponse.json(ads);
  } catch (e) {
    console.error('GET error', e);
    return NextResponse.json({ message: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = supabaseClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const ad = new Ad(
      body.id,
      user.id,
      body.title,
      body.imgUrl,
      body.redirectUrl,
      body.isActive,
      body.type
    );

    await createAdUseCase.execute(ad);
    return NextResponse.json({ message: 'Ad created' }, { status: 201 });
  } catch (e) {
    console.error('POST error', e);
    return NextResponse.json({ message: 'Failed to create ad' }, { status: 500 });
  }
}
