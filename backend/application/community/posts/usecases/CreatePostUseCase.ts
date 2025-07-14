// backend/application/community/posts/usecases/CreatePostUseCase.ts
import { PostRepository } from '@domain/repositories/PostRepository'
import { PostDto } from '../dtos/PostDto'
import { Post } from '@domain/entities/Post'

export class CreatePostUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(params: {
    userId: string
    title: string
    content: string
    categoryId: number
    town?: string
  }): Promise<PostDto> {
    const post: Post = await this.repo.postPost(
      params.userId,
      params.title,
      params.content,
      params.categoryId,
      params.town,
    )

    return {
      postId: post.postId,
      userId: post.userId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      town: post.town ?? null,
      hits: post.hits ?? 0,
      nickname: post.nickname ?? null,
      profileImgUrl: post.profileImgUrl ?? null,
    }
  }
}
