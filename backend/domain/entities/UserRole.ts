import { Role } from './Role'
import { User } from './User'

export class UserRole {
  constructor(
    public roles: Role, // N:1
  ) {}
}
