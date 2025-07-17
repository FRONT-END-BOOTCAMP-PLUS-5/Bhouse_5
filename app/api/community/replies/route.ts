import { CreateReplyUseCase } from '@be/application/community/replies/usecases/CreateReplyUseCase'
import { ReplyRepositoryImpl } from '@be/infrastructure/repositories/ReplyRepositoryImpl'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('[REPLY REQUEST BODY]', body)
  const { postId, userId, content, parentReplyId } = body

  const useCase = new CreateReplyUseCase(new ReplyRepositoryImpl())
  const result = await useCase.execute(postId, userId, content, parentReplyId)

  return NextResponse.json(result)
}
