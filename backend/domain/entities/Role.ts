import UserRole from './UserRole'

export class Role {
  constructor(
    public roleId: number,
    public name: string,
    public userRoles?: UserRole[], // 1:N
  ) {}
}
