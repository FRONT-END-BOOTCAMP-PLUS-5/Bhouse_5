// app/api/community/posts/[post_id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GetPostByIdUseCase } from '@application/community/posts/usecases/GetPostByIdUseCase'
import { PostRepositoryImpl } from '@infrastructure/repositories/PostRepositoryImpl'
import { UpdatePostUseCase } from '@be/application/community/posts/usecases/UpdatePostUseCase'

export async function GET(req: NextRequest, context: { params: { post_id?: string } }) {
  try {
    const postIdParam = context.params?.post_id
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

export async function PATCH(req: Request, context: { params: { post_id: string } }) {
  try {
    const postId = Number(context.params.post_id)
    if (isNaN(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 })
    }

    const body = await req.json()
    const { userId, title, content, categoryId, town } = body

    const usecase = new UpdatePostUseCase(new PostRepositoryImpl())
    const updated = await usecase.execute({
      postId,
      userId,
      title,
      content,
      categoryId,
      town,
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    console.error('[UpdatePostRoute Error]', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
