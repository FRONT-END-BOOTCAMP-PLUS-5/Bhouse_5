// backend/domain/entities/CommunityReply.ts

import { User } from './User'
import { CommunityPost } from './CommunityPost'

/**
 * 커뮤니티 댓글 엔티티입니다.
 * 댓글의 핵심 데이터와 비즈니스 규칙을 캡슐화합니다.
 */
export class CommunityReply {
  constructor(
    public replyId: number,
    public postId: number,
    public userId: string, // UUID
    public content: string, // text
    public parentReplyId: number | null, // bigint, null 허용
    public createdAt: Date,
    public updatedAt: Date,
    // 관계 (필요시 추가)
    public author?: User, // N:1 관계
    public post?: CommunityPost, // N:1 관계
    public parentReply?: CommunityReply, // 1:1 (self-referencing) 관계
  ) {}

  // 엔티티 관련 비즈니스 로직 메서드 추가 가능
}
