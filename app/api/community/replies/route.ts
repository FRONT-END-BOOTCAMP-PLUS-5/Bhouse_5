import { NextRequest, NextResponse } from 'next/server'
import { CreateReplyUseCase } from '@be/application/usecases/CreateReplyUseCase'
import { GetRepliesByPostIdUseCase } from '@be/application/usecases/GetRepliesByPostIdUseCase'
import { ReplyRepositoryImpl } from '@be/infrastructure/db/ReplyRepositoryImpl'

const repo = new ReplyRepositoryImpl()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = Number(searchParams.get('postId'))
  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  const useCase = new GetRepliesByPostIdUseCase(repo)
  const replies = await useCase.execute(postId)
  return NextResponse.json(replies)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { postId, userId, content, parentReplyId } = body

  if (!postId || !userId || !content) {
    return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 })
  }

  const useCase = new CreateReplyUseCase(repo)
  const reply = await useCase.execute(postId, userId, content, parentReplyId)
  return NextResponse.json(reply, { status: 201 })
}
