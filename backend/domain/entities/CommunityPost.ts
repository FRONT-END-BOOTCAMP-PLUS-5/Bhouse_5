// backend/domain/entities/CommunityPost.ts

import { User } from './User'
import { CommunityCategory } from './CommunityCategory'

/**
 * 커뮤니티 게시글 엔티티입니다.
 * 게시글의 핵심 데이터와 비즈니스 규칙을 캡슐화합니다.
 */
export class CommunityPost {
  constructor(
    public postId: number,
    public userId: string, // UUID
    public title: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date,
    public categoryId: number,
    public town: string | null,
    public hits: number,
    // 관계 (필요시 추가)
    public author?: User, // N:1 관계
    public category?: CommunityCategory, // N:1 관계
  ) {}

  // 엔티티 관련 비즈니스 로직 메서드 추가 가능
}
