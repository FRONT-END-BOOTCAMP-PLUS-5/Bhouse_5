import { IPostRepository } from '@domain/repositories/IPostRepository'

export class DeletePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(postId: number, userId: string) {
    return await this.postRepo.deletePost(postId, userId)
  }
}
