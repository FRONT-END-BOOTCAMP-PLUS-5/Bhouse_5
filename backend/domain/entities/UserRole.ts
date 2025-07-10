import { Roles } from './Roles'
import { User } from './User'

export class UserRole {
  constructor(
    public user_id: User,
    public role_id: Roles,
  ) {}
}
