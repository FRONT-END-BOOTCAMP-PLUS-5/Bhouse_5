// backend/application/community/posts/usecases/GetPostListUseCase.ts
import { PostRepository } from '@domain/repositories/PostRepository'
import { PostListDto } from '../dtos/PostListDto'

export class GetPostListUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(): Promise<PostListDto[]> {
    const { data: posts } = await this.repo.getPostList()

    return posts.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      title: post.title,
      createdAt: post.createdAt.toISOString(),
      town: post.town ?? null,
      hits: post.hits ?? 0,
      nickname: post.nickname ?? null,
      profileImgUrl: post.profileImgUrl ?? null,
    }))
  }
}
