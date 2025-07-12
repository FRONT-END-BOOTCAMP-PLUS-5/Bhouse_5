import UserRole from './UserRole'

export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public email: string,
    public nickname: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public deletedAt: Date | null,
    public profileImgUrl: string | null,
    public phone?: string,
    public provider?: string,
    public providerId?: string,
    public userRole?: UserRole, // 1:1 관계
  ) {}
}
