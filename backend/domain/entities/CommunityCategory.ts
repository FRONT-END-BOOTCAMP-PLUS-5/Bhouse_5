// backend/domain/entities/CommunityCategory.ts

/**
 * 커뮤니티 게시글 카테고리 엔티티입니다.
 */
export class CommunityCategory {
  constructor(
    public id: number,
    public name: string, // 카테고리 이름 (예: "자유게시판", "정보공유" 등)
  ) {}
}
