import { Role } from './Role'
import { User } from './User'

export default class UserRole {
  constructor(
    public roles: Role, // N:1
  ) {}
}
