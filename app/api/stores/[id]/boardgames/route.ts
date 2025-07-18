import { NextRequest, NextResponse } from 'next/server'
import { GetStoreBoardgamesUseCase } from '@be/application/boardgames/usecases/GetBoardgamesByStoreIdUseCase'
import { BoardgameRepositoryImpl } from '@be/infrastructure/repositories/BoardgameRepositoryImpl'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const storeId = Number(id)
  if (isNaN(storeId)) {
    return NextResponse.json({ success: false, error: 'Invalid store ID' }, { status: 400 })
  }

  const usecase = new GetStoreBoardgamesUseCase(new BoardgameRepositoryImpl())
  const result = await usecase.execute(storeId)

  return NextResponse.json({ success: true, data: result })
}
