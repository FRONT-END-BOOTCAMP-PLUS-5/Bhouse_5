import { NextRequest, NextResponse } from 'next/server';
import { AdRepositoryImpl } from './infrastructure/db/AdRepositoryImpl';
import { AdController } from './interface/controller/AdController';
import { GetAdUseCase } from './application/in/usecase/GetAdUseCase';
import { GetAdListUseCase } from './application/in/usecase/GetAdListUseCase';
import { CreateAdUseCase } from './application/in/usecase/CreateAdUseCase';
import { UpdateAdUseCase } from './application/in/usecase/UpdateAdUseCase';
import { DeleteAdUseCase } from './application/in/usecase/DeleteAdUseCase';


const repo = new AdRepositoryImpl();
const controller = new AdController(
  new GetAdUseCase(repo),
  new GetAdListUseCase(repo),
  new CreateAdUseCase(repo),
  new UpdateAdUseCase(repo),
  new DeleteAdUseCase(repo)
);

export async function GET() {
  const ads = await controller.getAllAds();
  return NextResponse.json(ads, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await controller.createAd(body);
  return NextResponse.json({ message: 'Ad created' }, { status: 201 });
}

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const userId = extractUserIdFromToken(req); // 예: decode JWT from cookie
//   const ad = new Ad(undefined, userId, body.title, body.imgUrl, body.redirectUrl, body.isActive);
//   await controller.createAd(ad);
//   return NextResponse.json({ message: 'Ad created' }, { status: 201 });
// }