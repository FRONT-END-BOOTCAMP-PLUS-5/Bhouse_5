import { NextRequest, NextResponse } from 'next/server'
import { BoardgameRepositoryImpl } from '@infrastructure/repositories/BoardgameRepositoryImpl'
import { GetBoardgameStoresUseCase } from '@application/boardgames/usecases/GetBoardgameStoresUseCase'

const repo = new BoardgameRepositoryImpl()
const usecase = new GetBoardgameStoresUseCase(repo)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const boardgameId = searchParams.get('boardgameId')

  if (!boardgameId) {
    return NextResponse.json({ error: 'boardgameId is required' }, { status: 400 })
  }

  const result = await usecase.execute(Number(boardgameId))
  return NextResponse.json(result)
}
