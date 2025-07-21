// app/api/community/posts/[post_id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GetPostByIdUseCase } from '@application/community/posts/usecases/GetPostByIdUseCase'
import { PostRepositoryImpl } from '@infrastructure/repositories/PostRepositoryImpl'
import { UserRepositoryImpl } from '@be/infrastructure/repositories/UserRepositoryImpl'
import { UpdatePostUseCase } from '@be/application/community/posts/usecases/UpdatePostUseCase'

export async function GET(req: NextRequest, context: { params: Promise<{ post_id?: string }> }) {
  try {
    const { post_id: postIdParam } = await context.params
    if (!postIdParam) {
      return NextResponse.json({ message: 'Missing post ID' }, { status: 400 })
    }

    const postId = Number(postIdParam)
    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 })
    }

    const usecase = new GetPostByIdUseCase(new PostRepositoryImpl())
    const result = await usecase.execute(postId)

    if (!result) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    console.error('[GetPostByIdRoute Error]', err)

    const message = err instanceof Error ? err.message : 'Internal Server Error'

    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ post_id: string }> }) {
  try {
    const { post_id: postIdParam } = await context.params
    const postId = Number(postIdParam)
    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 })
    }

    const body = await req.json()
    const { userId, title, content, categoryId } = body

    const usecase = new UpdatePostUseCase(new PostRepositoryImpl(), new UserRepositoryImpl())
    const updated = await usecase.execute({
      postId,
      userId,
      title,
      content,
      categoryId,
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('[UpdatePostRoute Error]', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
