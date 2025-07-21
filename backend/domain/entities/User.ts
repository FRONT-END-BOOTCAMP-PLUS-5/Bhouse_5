import { Alarm } from './Alarm'
import { UserRole } from './UserRole'

export class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public email: string,
    public nickname: string | null,
    public createdAt: Date,
    public updatedAt: Date | null,
    public isActive: string,
    public profileImgUrl: string | null,
    //관계ㅖ
    public userAlarms?: Alarm[], // 1:N
    public phone?: string,
    public provider?: string,
    public providerId?: string,
    public userRole?: UserRole, // 1:1 관계
  ) {}
}
