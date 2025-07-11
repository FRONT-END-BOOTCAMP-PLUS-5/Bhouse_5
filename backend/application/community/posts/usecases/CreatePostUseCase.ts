import { IPostRepository } from '@be/domain/repositories/PostRepository'

export class CreatePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(userId: string, title: string, content: string, town?: string) {
    return await this.postRepo.postPost(userId, title, content, town)
  }
}
