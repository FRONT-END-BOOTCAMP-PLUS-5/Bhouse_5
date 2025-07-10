import { IPostRepository } from '@domain/repositories/IPostRepository'

export class CreatePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(userId: string, title: string, content: string, town?: string) {
    return await this.postRepo.postPost(userId, title, content, town)
  }
}
