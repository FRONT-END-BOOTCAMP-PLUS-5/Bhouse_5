// backend/application/community/posts/usecases/GetPostListUseCase.ts

import { PostRepository } from '@domain/repositories/PostRepository'
import { PostListDto } from '../dtos/PostListDto'

export class GetPostListUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute({
    categoryId,
    townName,
    isLoggedIn,
  }: {
    categoryId: number | null
    townName: string | null
    isLoggedIn: boolean
  }): Promise<PostListDto[]> {
    const { data: posts } = await this.repo.getPostList({ categoryId, townName, isLoggedIn })

    return posts.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      title: post.title,
      createdAt: post.createdAt.toISOString(),
      town: post.town ?? null,
      hits: post.hits ?? 0,
      nickname: post.nickname ?? null,
      profileImgUrl: post.profileImgUrl ?? null,
      commentCount: post.commentCount ?? 0,
    }))
  }
}
