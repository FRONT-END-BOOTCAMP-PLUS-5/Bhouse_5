import { Post } from '../entities/Post'

export interface IPostRepository {
  updatePost(postId: number, title: string, content: string, userId: string): Promise<Post>
  deletePost(postId: number, userId: string): Promise<void>
  getPostById(postId: number): Promise<Post | null>
  postPost(userId: string, title: string, content: string, town?: string): Promise<Post>
}
