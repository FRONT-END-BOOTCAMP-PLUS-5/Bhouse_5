import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@bUtils/supabaseClient'
import { LikeRepositoryImpl } from '@infrastructure/repositories/LikeRepositoryImpl'
import { AddLikeUseCase } from '@be/application/user/likes/usecases/AddLikeUseCase'
import { RemoveLikeUseCase } from '@be/application/user/likes/usecases/RemoveLikeUseCase'
import { GetLikedBoardgamesUseCase } from '@be/application/user/likes/usecases/GetLikedBoardgamesUseCase'

const likeRepository = new LikeRepositoryImpl()

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token)

  if (!user || error) return NextResponse.json({ message: 'Auth error' }, { status: 401 })

  const usecase = new GetLikedBoardgamesUseCase(likeRepository)
  const data = await usecase.execute(user.id)

  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token)

  if (!user || error) return NextResponse.json({ message: 'Auth error' }, { status: 401 })

  const { boardgameId } = await req.json()
  const usecase = new AddLikeUseCase(likeRepository)
  await usecase.execute(user.id, boardgameId)

  return NextResponse.json({ message: '찜 완료' })
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token)

  if (!user || error) return NextResponse.json({ message: 'Auth error' }, { status: 401 })

  const { boardgameId } = await req.json()
  const usecase = new RemoveLikeUseCase(likeRepository)
  await usecase.execute(user.id, boardgameId)

  return NextResponse.json({ message: '찜 해제 완료' })
}
