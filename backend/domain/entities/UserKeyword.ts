// backend/domain/entities/UserKeyword.ts

export class UserKeyword {
  constructor(
    public keywordId: number,
    public userId: string, // UUID
    public keyword: string | null, // 스키마에 따라 null 허용
    public createdAt: Date,
  ) {}

  // 엔티티 관련 비즈니스 로직 메서드 추가 가능 (예: validateKeyword)
}
