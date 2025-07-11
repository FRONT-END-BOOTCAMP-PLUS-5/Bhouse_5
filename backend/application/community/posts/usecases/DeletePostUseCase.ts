import { IPostRepository } from '@be/domain/repositories/PostRepository'

export class DeletePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(postId: number, userId: string) {
    return await this.postRepo.deletePost(postId, userId)
  }
}
