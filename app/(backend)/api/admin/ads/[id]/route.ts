import { NextRequest, NextResponse } from 'next/server';
import { AdRepositoryImpl } from '../infrastructure/db/AdRepositoryImpl';
import { AdController } from '../interface/controller/AdController';
import { GetAdUseCase } from '../application/in/usecase/GetAdUseCase';
import { UpdateAdUseCase } from '../application/in/usecase/UpdateAdUseCase';
import { DeleteAdUseCase } from '../application/in/usecase/DeleteAdUseCase';

const repo = new AdRepositoryImpl();
const controller = new AdController(
  new GetAdUseCase(repo),
  { execute: async () => [] }, // getAdList stub
  { execute: async () => {} }, // createAd stub
  new UpdateAdUseCase(repo),
  new DeleteAdUseCase(repo)
);

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);
  const ad = await controller.getAd(id);
  return ad
    ? NextResponse.json(ad, { status: 200 })
    : NextResponse.json({ message: 'Ad not found' }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await req.json();
  await controller.updateAd(id, body);
  return NextResponse.json({ message: 'Ad updated' }, { status: 200 });
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);
  await controller.deleteAd(id);
  return new Response(null, { status: 204 }); 
}
