// app/api/users/likes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseClient } from '@bUtils/supabaseClient'
import { LikeRepositoryImpl } from '@infrastructure/repositories/LikeRepositoryImpl'
import { AddLikeUseCase } from '@be/application/user/likes/usecases/AddLikeUseCase'
import { GetLikedBoardgamesUseCase } from '@be/application/user/likes/usecases/GetLikedBoardgamesUseCase'
import { DeleteLikeUseCase } from '@be/application/user/likes/usecases/DeleteLikeUseCase'

const likeRepository = new LikeRepositoryImpl()

// ✅ 찜 목록 가져오기
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

// ✅ 찜 추가
export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token)

  if (!user || error) return NextResponse.json({ message: 'Auth error' }, { status: 401 })

  const { boardgameId } = await req.json()

  if (!boardgameId) {
    return NextResponse.json({ message: 'boardgameId is required' }, { status: 400 })
  }

  const usecase = new AddLikeUseCase(likeRepository)
  await usecase.execute({ userId: user.id, boardgameId })

  return NextResponse.json({ message: '찜 등록 완료' }, { status: 201 })
}

// ✅ 찜 삭제
export async function DELETE(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(token)

  if (!user || error) return NextResponse.json({ message: 'Auth error' }, { status: 401 })

  const { boardgameId } = await req.json()
  if (!boardgameId) {
    return NextResponse.json({ message: 'boardgameId is required' }, { status: 400 })
  }

  const usecase = new DeleteLikeUseCase(likeRepository)
  await usecase.execute(user.id, boardgameId)

  return NextResponse.json({ message: '찜 해제 완료' })
}
