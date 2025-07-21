import { NextRequest, NextResponse } from 'next/server'
import { ReplyRepositoryImpl } from '@be/infrastructure/repositories/ReplyRepositoryImpl'
import { UpdateReplyUseCase } from '@be/application/community/replies/usecases/UpdateReplyUseCase'
import { DeleteReplyUseCase } from '@be/application/community/replies/usecases/DeleteReplyUseCase'
import { GetReplyByIdUseCase } from '@be/application/community/replies/usecases/GetReplyByIdUseCase'
import { verifyToken } from '@be/utils/auth'

const repo = new ReplyRepositoryImpl()

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const replyId = Number(params.id)
  const useCase = new GetReplyByIdUseCase(repo)
  const reply = await useCase.execute(replyId)
  return NextResponse.json(reply)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const replyId = Number(params.id)
  const body = await req.json()
  const { userId, content } = body

  const useCase = new UpdateReplyUseCase(repo)
  const updated = await useCase.execute(replyId, userId, content)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const decoded = verifyToken(req)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const replyId = Number(params.id)
  const useCase = new DeleteReplyUseCase(repo)
  await useCase.execute(replyId, decoded.userId)
  return NextResponse.json({ success: true })
}
