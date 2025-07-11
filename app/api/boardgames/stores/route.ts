import { NextRequest, NextResponse } from 'next/server'
import { GetPostListUseCase } from '@application/community/posts/usecases/GetPostListUseCase'
import { PostRepositoryImpl } from '@infrastructure/repositories/PostRepositoryImpl'

const usecase = new GetPostListUseCase(new PostRepositoryImpl())

export async function GET(req: NextRequest) {
  console.log(req)
  try {
    const result = await usecase.execute()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: '불러오기 실패', error }, { status: 500 })
  }
}
