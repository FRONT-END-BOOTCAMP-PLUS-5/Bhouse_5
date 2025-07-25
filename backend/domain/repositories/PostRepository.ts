import { Post } from '../entities/Post'

// This interface defines the methods for interacting with posts in the community.
// It includes methods for creating, updating, deleting, and retrieving posts.
// Each method returns a Promise that resolves to the appropriate type, such as Post or void.
// The methods also include parameters for post ID, user ID, title, content, and optional
// parameters like town, which can be used to filter or categorize posts.
//// Example usage:
// const postRepo: IPostRepository = new PostRepositoryImpl();

export interface PostRepository {
  updatePost(
    postId: number,
    userId: string,
    title: string,
    content: string,
    categoryId?: number,
    town?: string,
  ): Promise<Post>

  deletePost(postId: number, userId: string): Promise<void>

  getPostList(params: {
    categoryId: number | null
    townName: string | null
    isLoggedIn: boolean
  }): Promise<{ data: Post[]; townName: string | null; total: number }>

  getPostById(postId: number): Promise<Post | null>

  postPost(userId: string, title: string, content: string, categoryId: number, town?: string): Promise<Post>
}
