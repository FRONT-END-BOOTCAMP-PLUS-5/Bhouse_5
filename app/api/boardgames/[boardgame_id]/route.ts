import { NextRequest, NextResponse } from 'next/server'
import { GetBoardgameByIdUseCase } from '@application/boardgames/usecases/GetBoardgameByIdUseCase'
import { BoardgameRepositoryImpl } from '@infrastructure/repositories/BoardgameRepositoryImpl'

export async function GET(req: NextRequest) {
  const usecase = new GetBoardgameByIdUseCase(new BoardgameRepositoryImpl())
  const segments = req.nextUrl.pathname.split('/')
  const boardgameId = Number(segments[segments.length - 1])

  if (isNaN(boardgameId)) {
    return NextResponse.json({ message: 'Invalid boardgame ID' }, { status: 400 })
  }

  try {
    const result = await usecase.execute(boardgameId)

    if (!result) {
      return NextResponse.json({ message: 'Boardgame not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching boardgame', error }, { status: 500 })
  }
}
