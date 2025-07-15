import { Role } from './Role'
import { User } from './User'

export default class UserRole {
  constructor(
    public userId: string, // uuid
    public roleId: number, // bigint
    public user?: User, // N:1
    public role?: Role, // N:1
  ) {}
}
