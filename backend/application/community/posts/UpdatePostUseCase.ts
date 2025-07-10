import { IPostRepository } from '@/backend/domain/repositories/IPostRepository'

export class UpdatePostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async execute(postId: number, title: string, content: string, userId: string) {
    return await this.postRepo.updatePost(postId, title, content, userId)
  }
}