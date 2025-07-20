import { PostRepository } from '@be/domain/repositories/PostRepository'
import { PostDto } from '../dtos/PostDto'
import { UserRepository } from '@be/domain/repositories/UserRepository'

export class CreatePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute({
    userId,
    title,
    content,
    categoryId,
  }: {
    userId: string
    title: string
    content: string
    categoryId: number
  }): Promise<PostDto> {
    // ✅ 유저의 대표 동네 조회
    const primaryTown = await this.userRepo.getPrimaryTownByUserId(userId)
    if (!primaryTown) throw new Error('대표 동네가 설정되지 않았습니다.')

    const post = await this.postRepo.postPost(userId, title, content, categoryId, primaryTown)

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
