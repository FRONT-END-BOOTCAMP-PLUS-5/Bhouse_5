import { NextRequest, NextResponse } from 'next/server'
import { GetBoardgameStoresUseCase } from '@application/boardgames/stores/usecases/GetBoardgameStoresUseCase'
import { StoreRepositoryImpl } from '@infrastructure/repositories/StoreRepositoryImpl'

const usecase = new GetBoardgameStoresUseCase(new StoreRepositoryImpl())

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const boardgameIdParam = searchParams.get('boardgame_id')
  const boardgameId = Number(boardgameIdParam)

  if (!boardgameIdParam || isNaN(boardgameId)) {
    return NextResponse.json({ message: 'Invalid boardgame ID' }, { status: 400 })
  }

  try {
    const stores = await usecase.execute(boardgameId)
    return NextResponse.json(stores)
  } catch (error) {
    console.error('[GetBoardgameStoresRoute Error]', error)
    return NextResponse.json({ message: 'Failed to fetch stores', error }, { status: 500 })
  }
}
