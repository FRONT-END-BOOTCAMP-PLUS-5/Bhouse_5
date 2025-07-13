// backend/application/community/posts/usecases/GetPostByIdUseCase.ts
import { PostRepository } from '@domain/repositories/PostRepository'
import { Post } from '@domain/entities/Post'
import { PostDto } from '../dtos/PostDto'

export class GetPostByIdUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(postId: number): Promise<PostDto | null> {
    const post: Post | null = await this.repo.getPostById(postId)
    if (!post) return null

    return {
      postId: post.postId,
      userId: post.userId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      town: post.town ?? null,
      hits: post.hits ?? 0,
      nickname: post.nickname ?? null,
      profileImgUrl: post.profileImgUrl ?? null,
    }
  }
}
