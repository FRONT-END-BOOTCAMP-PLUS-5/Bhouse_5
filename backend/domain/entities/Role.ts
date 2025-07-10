import UserRole from './UserRole'

export default class Role {
  constructor(
    public roleId: string,
    public name: string,
    public userRoles?: UserRole[], // 1:N
  ) {}
}
