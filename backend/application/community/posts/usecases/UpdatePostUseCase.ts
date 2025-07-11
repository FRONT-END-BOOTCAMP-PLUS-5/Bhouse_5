import { IPostRepository } from '@be/domain/repositories/PostRepository'

export class UpdatePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(postId: number, title: string, content: string, userId: string) {
    return await this.postRepo.updatePost(postId, title, content, userId)
  }
}
