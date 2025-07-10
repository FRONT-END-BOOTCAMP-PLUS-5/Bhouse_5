import { UserRole } from './UserRole';
import { Alarm } from './Alarms';

export class User {
  constructor(
    public id: string,
    public username: string,
    public nickname : string,
    public password: string,
    public email: string,
    public createdAt: Date,
    public deletedAt: Date | null,
    public image: string | null,
    public updatedAt: Date | null,
    public phone?: string | null,
    public provider?: string,
    public providerId?: string | null,
    //관계
    public userRole?: UserRole,
    public userAlarms?: Alarm[], // 1:N,
  ) {}
}