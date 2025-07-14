// app/api/boardgames/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BoardgameRepositoryImpl } from '@infrastructure/repositories/BoardgameRepositoryImpl'
import { SearchBoardgamesUseCase } from '@application/boardgames/usecases/SearchBoardgamesUseCase'

const usecase = new SearchBoardgamesUseCase(new BoardgameRepositoryImpl())

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const name = searchParams.get('name') || undefined
  const genre = searchParams.get('genre') || undefined
  const minPlayers = searchParams.get('minPlayers') ? Number(searchParams.get('minPlayers')) : undefined
  const maxPlayers = searchParams.get('maxPlayers') ? Number(searchParams.get('maxPlayers')) : undefined

  const result = await usecase.execute({ name, genre, minPlayers, maxPlayers })
  return NextResponse.json(result)
}
