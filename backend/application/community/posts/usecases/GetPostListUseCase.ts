import { PostRepository } from '@domain/repositories/PostRepository'

export class GetPostListUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(): Promise<ReturnType<PostRepository['getPostList']>> {
    return this.repo.getPostList()
  }
}
