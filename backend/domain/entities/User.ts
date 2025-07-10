import UserRole from './UserRole'
import Alarm from './Alarm'

export default class User {
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public email: string,
    public nickname: string,
    public createdAt: Date,
    public updatedAt: Date | null,
    public image: string | null,
    //관계
    public userRole: UserRole,
    public userAlarms?: Alarm[], // 1:N
    public phone?: string,
    public provider?: string,
    public providerId?: string,
  ) {}
}
