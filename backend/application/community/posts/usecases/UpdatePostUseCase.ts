import { PostRepository } from '@domain/repositories/PostRepository'
import { UserRepository } from '@domain/repositories/UserRepository'
import { PostDto } from '../dtos/PostDto'
import { Post } from '@domain/entities/Post'

export class UpdatePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(params: {
    postId: number
    userId: string
    title: string
    content: string
    categoryId?: number
  }): Promise<PostDto> {
    // ✅ 유저의 대표 동네 조회
    const primaryTown = await this.userRepo.getPrimaryTownByUserId(params.userId)
    if (!primaryTown) throw new Error('대표 동네가 설정되지 않았습니다.')

    // ✅ 대표 동네를 서버에서 지정하여 수정
    const post: Post = await this.postRepo.updatePost(
      params.postId,
      params.userId,
      params.title,
      params.content,
      params.categoryId,
      primaryTown,
    )

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
